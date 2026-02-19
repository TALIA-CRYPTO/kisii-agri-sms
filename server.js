const express = require('express');
const AfricasTalking = require('africastalking');
const fs = require('fs');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const session = require('express-session');

const app = express();

// Session setup
app.use(session({
    secret: 'kisii-agri-secret-2026-change-this',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        httpOnly: true,
        secure: false
    }
}));

app.use(cors({
    credentials: true,
    origin: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Admin credentials (MUST be before routes)
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD_HASH = bcrypt.hashSync('my very first', 10);

// Auth middleware (MUST be before routes)
function requireAuth(req, res, next) {
    console.log('Auth check - isAdmin:', req.session.isAdmin);
    if (req.session && req.session.isAdmin) {
        next();
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
}

// Africa's Talking setup
const africastalking = AfricasTalking({
    apiKey: process.env.API_KEY,
    username: 'sandbox'
});

const sms = africastalking.SMS;

// Data storage
let farmers = [];
let prices = {
    maize: 0,
    beans: 0,
    tomatoes: 0,
    bananas: 0,
    potatoes: 0,
    avocados: 0
};

// Load existing data
try {
    farmers = JSON.parse(fs.readFileSync('farmers.json', 'utf8'));
    prices = JSON.parse(fs.readFileSync('prices.json', 'utf8'));
    console.log('Data loaded:', farmers.length, 'farmers');
} catch (e) {
    console.log('No existing data, starting fresh');
}

// Log SMS function
function logSMS(phone, success, errorMsg = null) {
    const logEntry = {
        timestamp: new Date().toISOString(),
        phone,
        success,
        error: errorMsg
    };

    let logs = [];
    try {
        logs = JSON.parse(fs.readFileSync('sms-logs.json', 'utf8'));
    } catch (e) {}

    logs.push(logEntry);
    fs.writeFileSync('sms-logs.json', JSON.stringify(logs, null, 2));
}

// ==================
// AUTH ROUTES
// ==================

app.post('/admin/login', (req, res) => {
    const { username, password } = req.body;
    
    console.log('Login attempt:', username);

    if (username === ADMIN_USERNAME && bcrypt.compareSync(password, ADMIN_PASSWORD_HASH)) {
        req.session.isAdmin = true;
        req.session.save((err) => {
            if (err) {
                console.error('Session save error:', err);
                return res.status(500).json({ success: false, error: 'Session error' });
            }
            console.log('Login successful, session:', req.session);
            res.json({ success: true, message: 'Login successful' });
        });
    } else {
        console.log('Invalid credentials');
        res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
});

app.get('/admin/check-auth', (req, res) => {
    console.log('Check auth - session:', req.session);
    res.json({ isAuthenticated: !!req.session.isAdmin });
});

app.post('/admin/logout', (req, res) => {
    req.session.destroy();
    res.json({ success: true, message: 'Logged out' });
});

// ==================
// PUBLIC ROUTES
// ==================

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/admin/prices', (req, res) => {
    res.json(prices);
});

app.post('/register', (req, res) => {
    const { phone, crops } = req.body;

    if (!phone || !phone.startsWith('+254')) {
        return res.status(400).json({
            success: false,
            error: 'Valid phone number required (+254...)'
        });
    }

    const exists = farmers.find(f => f.phone === phone);
    if (exists) {
        return res.status(400).json({
            success: false,
            error: 'Farmer already registered'
        });
    }

    farmers.push({ phone, crops, registered: new Date() });
    fs.writeFileSync('farmers.json', JSON.stringify(farmers, null, 2));
    console.log('Farmer registered:', phone);
    res.json({ success: true, total: farmers.length });
});

app.get('/farmers', (req, res) => {
    res.json({ count: farmers.length, farmers });
});

app.post('/test-sms', async (req, res) => {
    const { phone } = req.body;

    if (!phone) {
        return res.status(400).json({
            success: false,
            error: 'Phone number is required'
        });
    }

    if (!phone.startsWith('+254')) {
        return res.status(400).json({
            success: false,
            error: 'Phone must start with +254'
        });
    }

    if (phone.length !== 13) {
        return res.status(400).json({
            success: false,
            error: 'Invalid length. Format: +254712345678'
        });
    }

    try {
        const today = new Date().toLocaleDateString('en-GB');
        const message = `TEST - Kisii AgriPrice (${today}):
Maize: ${prices.maize || 45} KES/kg
Beans: ${prices.beans || 80} KES/kg
Tomatoes: ${prices.tomatoes || 60} KES/kg
Bananas: ${prices.bananas || 30} KES/kg
Potatoes: ${prices.potatoes || 40} KES/kg
Avocados: ${prices.avocados || 15} KES/piece
- AgriPrice Kisii`;

        const result = await sms.send({ to: [phone], message });
        console.log('Test SMS sent to:', phone);

        logSMS(phone, true);
        res.json({
            success: true,
            message: 'SMS sent successfully',
            recipient: phone
        });

    } catch (error) {
        console.log('Test SMS FAILED:', phone, '| REASON:', error.message);

        logSMS(phone, false, error.message);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// ==================
// PROTECTED ROUTES
// ==================

app.post('/admin/prices', requireAuth, (req, res) => {
    prices = req.body;
    fs.writeFileSync('prices.json', JSON.stringify(prices, null, 2));
    console.log('Prices updated:', prices);
    res.json({ success: true, prices });
});

app.post('/send-sms', requireAuth, async (req, res) => {
    const today = new Date().toLocaleDateString('en-GB');
    const message = `Kisii Sokoni (${today}):
Maize: ${prices.maize} KES/kg
Beans: ${prices.beans} KES/kg
Tomatoes: ${prices.tomatoes} KES/kg
Bananas: ${prices.bananas} KES/kg
Potatoes: ${prices.potatoes} KES/kg
Avocados: ${prices.avocados} KES/piece
- AgriPrice Kisii`;

    let sent = 0;
    let failed = 0;

    for (let farmer of farmers) {
        try {
            await sms.send({ to: [farmer.phone], message });
            sent++;
            logSMS(farmer.phone, true);
            console.log('SUCCESS: Sent to', farmer.phone);
        } catch (error) {
            failed++;
            logSMS(farmer.phone, false, error.message);
            console.log('FAILED:', farmer.phone, '| REASON:', error.message);
        }
    }

    res.json({ sent, failed, total: farmers.length });
});

app.get('/admin/sms-logs', requireAuth, (req, res) => {
    try {
        const logs = JSON.parse(fs.readFileSync('sms-logs.json', 'utf8'));
        res.json({ logs, total: logs.length });
    } catch (e) {
        res.json({ logs: [], total: 0 });
    }
});

// ==================
// START SERVER
// ==================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});