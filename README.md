# 🌾 Kisii AgriPrice - SMS Market Prices for Farmers

**Live Demo:** https://kisii-agri-sms.onrender.com

Daily SMS market price updates for small-scale farmers in Kisii, Kenya.

---

## 📋 Table of Contents

- [The Problem](#the-problem)
- [The Solution](#the-solution)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Demo Credentials](#demo-credentials)
- [Installation](#installation)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [Business Model](#business-model)
- [Roadmap](#roadmap)

---

## 🎯 The Problem

Small-scale farmers in Kisii lose 20-40% of their income by selling crops without knowing current market prices. Middlemen exploit this information gap, buying low from farmers and selling high at markets.

**Current challenges:**
- No reliable source for local Kisii market prices
- Existing apps are Kenya-wide (not local enough)
- Many farmers don't have smartphones
- Extension officers reach only a fraction of farmers

---

## ✅ The Solution

**Kisii AgriPrice** delivers daily SMS updates with actual Kisii local market prices to ANY mobile phone - no smartphone or internet required.

**Key differentiators:**
1. **Kisii-specific** - Local market prices, not generic national data
2. **SMS-first** - Works on feature phones (90%+ rural penetration)
3. **Focused** - Only market prices (not bloated with unused features)
4. **Affordable** - 50-100 KES/month per farmer

---

## 🚀 Features

### For Farmers (Public)
✅ **SMS Price Updates** - Daily market prices via text message  
✅ **Free Trial** - Test SMS service on homepage  
✅ **Simple Registration** - Just phone number + crops grown  
✅ **No App Required** - Works on any mobile phone  

### For Admin
✅ **Secure Authentication** - Password-protected admin panel  
✅ **Price Management** - Update 6 crop prices (maize, beans, tomatoes, bananas, potatoes, avocados)  
✅ **Farmer Dashboard** - View, search, and manage registered farmers  
✅ **SMS Logs** - Track delivery status and success rates  
✅ **Stats Dashboard** - Real-time metrics (total farmers, SMS sent, success rate)  
✅ **Bulk SMS** - Send updates to all farmers with one click  

---

## 🛠 Tech Stack

**Backend:**
- Node.js + Express
- bcryptjs (password hashing)
- express-session (authentication)

**SMS Integration:**
- Africa's Talking SMS API

**Database:**
- JSON file storage (farmers.json, prices.json, sms-logs.json)
- Future: MongoDB for scale

**Deployment:**
- Render (backend hosting)
- GitHub (version control)

---

## 🔐 Demo Credentials

**Admin Panel:** https://kisii-agri-sms.onrender.com/admin
```
Username: admin
Password: [Contact for demo access]
```

**Public Test:** https://kisii-agri-sms.onrender.com (Try SMS test form)

---

## 📦 Installation

### Prerequisites
- Node.js v16+
- Africa's Talking account + API key

### Local Setup
```bash
# Clone repository
git clone https://github.com/TALIA-CRYPTO/kisii-agri-sms.git
cd kisii-agri-sms

# Install dependencies
npm install

# Set environment variables
# Create .env file:
PORT=3000
API_KEY=your_africastalking_api_key

# Run server
npm start

# Visit
http://localhost:3000
```

### Change Admin Password

Edit `server.js` line 27:
```javascript
const ADMIN_PASSWORD_HASH = bcrypt.hashSync('YOUR_NEW_PASSWORD', 10);
```

---

## 📡 API Endpoints

### Public Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Homepage |
| POST | `/test-sms` | Send test SMS |
| POST | `/register` | Register farmer |
| GET | `/farmers` | List farmers |

### Protected Endpoints (Require Auth)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/admin/login` | Admin login |
| GET | `/admin/check-auth` | Check auth status |
| POST | `/admin/logout` | Logout |
| GET | `/admin/prices` | Get current prices |
| POST | `/admin/prices` | Update prices |
| POST | `/send-sms` | Send SMS to all farmers |
| POST | `/delete-farmer` | Delete farmer |
| GET | `/admin/sms-logs` | View SMS logs |

---

## 📁 Project Structure
```
kisii-agri-sms/
├── server.js              # Main Express server
├── package.json           # Dependencies
├── README.md              # Documentation
├── public/                # Frontend files
│   ├── home.html          # Public homepage
│   ├── index.html         # Admin panel
│   ├── login.html         # Admin login
│   └── farmers.html       # Farmer management
├── farmers.json           # Registered farmers (generated)
├── prices.json            # Current prices (generated)
└── sms-logs.json          # SMS delivery logs (generated)
```

---

## 💰 Business Model

### Pricing
- **First 5 farmers:** FREE
- **Per farmer:** 50-100 KES/month

### Unit Economics
- **SMS cost:** 0.80 KES/message
- **Daily SMS:** 30 days × 0.80 = 24 KES/farmer/month
- **Monthly profit:** 26-76 KES/farmer (52-76% margin)

### Break-even
- **100 farmers** = ~5,000 KES/month revenue
- **500 farmers** = ~25,000 KES/month revenue

### Value Proposition
- Farmers save 1,000-5,000 KES per sale
- 100 KES/month = 1-2% of one transaction
- **ROI:** 10-50x monthly investment

---

## 🗺 Roadmap

### Phase 1: MVP (Complete) ✅
- [x] SMS integration
- [x] Admin authentication
- [x] Price updates
- [x] Farmer registration
- [x] Stats dashboard
- [x] Farmer management

### Phase 2: Enhanced Features (Next 2 weeks)
- [ ] Weather alerts
- [ ] Planting schedules
- [ ] Mobile money integration (M-Pesa subscriptions)
- [ ] WhatsApp bot alternative
- [ ] SMS keyword commands ("MAIZE" → get maize price)

### Phase 3: Scale (Month 2-3)
- [ ] Migrate to MongoDB
- [ ] Multi-region support (beyond Kisii)
- [ ] Farmer mobile app (optional)
- [ ] Partnerships with extension officers
- [ ] Crowdsourced price reporting

---

## 📊 Current Status

**Development:** MVP Complete  
**Testing:** Sandbox mode (production pending KYC verification)  
**Farmers:** 3 test registrations  
**SMS Sent:** 15+ test messages  
**Success Rate:** 100% (sandbox)  

---

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📞 Contact

**Project Maintainer:** TALIA-CRYPTO  
**Email:** [Your email here]  
**GitHub:** https://github.com/TALIA-CRYPTO/kisii-agri-sms  

---

## 📄 License

This project is open source and available under the MIT License.

---

## 🙏 Acknowledgments

- Africa's Talking for SMS API
- Kisii farmers for feedback and validation
- Render for hosting

---

**Built with ❤️ for Kisii farmers**