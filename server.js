const express = require('express');
const AfricasTalking = require('africastalking');
const fs = require('fs');

const cors = require('cors');
app.use(cors());

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Africa's Talking setup
const africastalking = AfricasTalking({
    apiKey: 'process.env.API_KEY',
    username: 'sandbox'
});

const sms = africastalking.SMS;

// Data storage (simple JSON files)
let farmers = [];
let prices = { 
    maize: 0, 
    beans: 0, 
    tomatoes: 0, 
    bananas: 0, 
    potatoes: 0, 
    avocados: 0 
};
app.post('/test-sms', async (req, res) => {
    const { phone } = req.body;
    
    // Edge Case 1: Validate phone format
    if (!phone) {
        return res.status(400).json({ 
            success: false, 
            error: 'Phone number is required' 
        });
    }
    
    // Edge Case 2: Check if starts with +254
    if (!phone.startsWith('+254')) {
        return res.status(400).json({ 
            success: false, 
            error: 'Phone must start with +254 (Kenya country code)' 
        });
    }
    
    // Edge Case 3: Check length (Kenyan numbers are +254 + 9 digits = 13 chars)
    if (phone.length !== 13) {
        return res.status(400).json({ 
            success: false, 
            error: 'Invalid phone number length. Format: +254712345678' 
        });
    }
    
    // Edge Case 4: Check if only contains numbers after +254
    const numberPart = phone.slice(4);
    if (!/^\d+$/.test(numberPart)) {
        return res.status(400).json({ 
            success: false, 
            error: 'Phone number contains invalid characters' 
        });
    }
    
    try {
        const today = new Date().toLocaleDateString('en-GB');
        
        // Edge Case 5: Check if prices are set
        const hasPrices = Object.values(prices).some(p => p > 0);
        if (!hasPrices) {
            return res.status(400).json({ 
                success: false, 
                error: 'No prices set yet. Admin must update prices first.' 
            });
        }
        
        const message = `TEST - Kisii AgriPrice (${today}):
	Maize: ${prices.maize || 0} KES/kg
	Beans: ${prices.beans || 0} KES/kg
	Tomatoes: ${prices.tomatoes || 0} KES/kg
	Bananas: ${prices.bananas || 0} KES/kg
	Potatoes: ${prices.potatoes || 0} KES/kg
	Avocados: ${prices.avocados || 0} KES/piece
	- Test SMS`;
        
        const result = await sms.send({ 
            to: [phone], 
            message 
        });
        
        console.log('SMS sent successfully:', result);
        res.json({ 
            success: true, 
            message: 'SMS sent successfully',
            recipient: phone
        });
        
    } catch (error) {
        console.error('SMS Error:', error);
        
        // Edge Case 6: Handle API errors gracefully
        let errorMsg = 'Failed to send SMS. ';
        if (error.message.includes('insufficient')) {
            errorMsg += 'Insufficient airtime balance.';
        } else if (error.message.includes('invalid')) {
            errorMsg += 'Invalid phone number.';
        } else {
            errorMsg += error.message;
        }
        
        res.status(500).json({ 
            success: false, 
            error: errorMsg
        });
    }
});
// At the top with other requires
const fs = require('fs');

// Create log function
function logSMS(phone, success, error = null) {
    const timestamp = new Date().toISOString();
    const logEntry = {
        timestamp,
        phone,
        success,
        error: error ? error.message : null
    };
	

    app.get('/admin/sms-logs', (req, res) => {
    try {
        const logs = JSON.parse(fs.readFileSync('sms-logs.json', 'utf8'));
        res.json({ logs, total: logs.length });
    } catch (e) {
        res.json({ logs: [], total: 0 });
    }
});
    let logs = [];
    try {
        logs = JSON.parse(fs.readFileSync('sms-logs.json', 'utf8'));
    } catch (e) {
        // File doesn't exist yet
    }
    
    logs.push(logEntry);
    fs.writeFileSync('sms-logs.json', JSON.stringify(logs, null, 2));
}

// In the /test-sms endpoint, after success:
logSMS(phone, true);

// In the catch block:
logSMS(phone, false, error);

// Load data if exists
try {
    farmers = JSON.parse(fs.readFileSync('farmers.json', 'utf8'));
    prices = JSON.parse(fs.readFileSync('prices.json', 'utf8'));
} catch (e) {
    console.log('No existing data, starting fresh');
}

// Routes
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Admin: Update prices
app.post('/admin/prices', (req, res) => {
    prices = req.body;
    fs.writeFileSync('prices.json', JSON.stringify(prices, null, 2));
    res.json({ success: true, prices });
});

// Admin: Get current prices
app.get('/admin/prices', (req, res) => {
    res.json(prices);
});

// Register farmer
app.post('/register', (req, res) => {
    const { phone, crops } = req.body;
    farmers.push({ phone, crops, registered: new Date() });
    fs.writeFileSync('farmers.json', JSON.stringify(farmers, null, 2));
    res.json({ success: true, total: farmers.length });
});

// Get farmers list
app.get('/farmers', (req, res) => {
    res.json({ count: farmers.length, farmers });
});

// Send SMS to all farmers
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
    console.log('SUCCESS: Sent to', farmer.phone);
} catch (error) {
    failed++;
    console.log('FAILED to send to:', farmer.phone);
    console.log('REASON:', error.message);
    console.log('FULL ERROR:', JSON.stringify(error, null, 2));
}    
    res.json({ sent, failed, total: farmers.length });
});
// Add this route BEFORE app.listen()
app.post('/test-sms', async (req, res) => {
    const { phone } = req.body;
    
    // Validate phone format
    if (!phone || !phone.startsWith('+254')) {
        return res.status(400).json({ 
            success: false, 
            error: 'Phone must start with +254' 
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
- Test SMS from AgriPrice`;
        
        const result = await sms.send({ 
            to: [phone], 
            message 
        });
        
        console.log('Test SMS sent to:', phone, result);
        res.json({ success: true, message: 'SMS sent successfully' });
        
    } catch (error) {
        console.error('SMS Error:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

const PORT =  process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});