\# 🌾 Kisii AgriPrice - SMS Market Prices for Farmers



\*\*Live Demo:\*\* https://kisii-agri-sms.onrender.com



\## The Problem

Small-scale farmers in Kisii sell crops without knowing current market prices, losing 20-40% to middlemen who exploit information asymmetry.



\## The Solution

Daily SMS with Kisii local market prices delivered to ANY phone (no smartphone needed).



\### Why Different from Existing Apps?

1\. \*\*Kisii-only\*\* - Hyper-local pricing, not generic Kenya-wide data

2\. \*\*SMS-first\*\* - Works on feature phones (90% of rural farmers)

3\. \*\*Market prices only\*\* - Focused solution, not bloated with unused features



\## Features

\- ✅ Admin dashboard for daily price updates

\- ✅ Farmer registration (phone number + crops grown)

\- ✅ Bulk SMS delivery via Africa's Talking API

\- ✅ Tracks registered farmers and delivery status



\## Tech Stack

\- \*\*Backend:\*\* Node.js + Express

\- \*\*SMS API:\*\* Africa's Talking (Kenya-focused)

\- \*\*Deployment:\*\* Render (free tier)

\- \*\*Storage:\*\* JSON file-based (will migrate to MongoDB for scale)



\## How It Works

1\. Admin visits market daily, enters prices

2\. System sends SMS to all registered farmers

3\. Farmers receive: "Kisii Sokoni: Maize 45 KES/kg, Beans 80 KES/kg..."



\## Business Model

\- Freemium: First 5 farmers free

\- 50-100 KES/month per farmer

\- Break-even at 100 farmers (~5,000 KES/month revenue)



\## Next Steps

\- \[ ] Add 100 KES airtime for production SMS

\- \[ ] Recruit 10 test farmers in Kisii

\- \[ ] Validate willingness to pay

\- \[ ] Add weather alerts \& planting schedules (Phase 2)



\## Local Setup

```bash

npm install

npm start

\# Visit http://localhost:3000

```



\## Environment Variables

```

PORT=3000

API\_KEY=your\_africastalking\_api\_key

```



\## Demo Credentials

\- Admin panel: https://kisii-agri-sms.onrender.com

\- No login required (MVP - will add auth in production)



---



\*\*Built in 48 hours for Kisii farmers. Real problem. Real solution.\*\*

