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
        } catch (error) {
            failed++;
            console.log('Failed to send to:', farmer.phone);
        }
    }
    
    res.json({ sent, failed, total: farmers.length });
});

const PORT =  process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});