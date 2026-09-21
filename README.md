# CampusHustle Kenya 

**CampusHustle** is a specialized, low-bandwidth financial operating engine engineered for Kenyan higher-education university students (MMU, UoN, KU, JKUAT, Strathmore, Egerton, Moi).

---

##  Core Features

1. **Campus Opportunities & Escrow Gigs**:
   - Escrow-secured campus bounties (LaTeX, tutoring, coding, data analysis).
   - Remote AI prompt verification batches ($14–$20/hr via Alignerr, DataAnnotation, Outlier, Mindrift).
   - Scraped internship attachments (Safaricom, KCB, Fuzu, BrighterMonday).
   - Real-time automatic task stream with exact ISO launch timestamps.

2. **HELB Runway & Survival Calculator**:
   - Log daily Kibanda meals, Safaricom bundles, cyber printing, and hostel rent.
   - Computes exact days of survival fuel remaining until semester exams.

3. **CMA-Regulated MMF Yield Compounders**:
   - Live daily Effective Annual Rate (EAR) sparklines across licensed Kenyan Money Market Funds (Etica, Lofty-Corban, Kuza, GenAfrica, CIC, Sanlam up to 16.85% EAR).
   - Daily interest compound simulators.

4. **Safaricom Daraja 2.0 STK Micro-Paywall**:
   - KSh 130 one-time semester all-access pass via instant M-Pesa STK push.
   - Unlocks client contact numbers, WhatsApp direct chats, and PDF export statements.

5. **Isolated Admin Command Center **:
   - Restricted access exclusively.
   - Real-time student subscription metrics, campus distribution, and Daraja escrow audits.

6. **Aesthetics & UX**:
   - Minimalist 2-color design (Monochrome Slate/White + Safaricom Emerald Green `#059669`).
   - Enhanced Light Mode default with dark mode toggle.
   - 100% mobile-friendly with sliding drawer and fixed bottom navigation.
   - Zero emojis (100% SVG Lucide vector icons).

---

##  Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS (Minimalist 2-color design)
- **Icons**: Lucide React (SVG)
- **Payment Gateway Simulation**: Safaricom Daraja 2.0 REST API

---

##  Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

---

## 📦 Hosting on Vercel (1-Click & Git Integration)

Deploying CampusHustle to Vercel is seamless:

### Option 1: Vercel Web Dashboard (Recommended)
1. Go to [vercel.com](https://vercel.com) and log in with your GitHub account.
2. Click **"Add New..."** -> **"Project"**.
3. Select the repository: `liliankavengi/Campushustle`.
4. Vercel will automatically detect **Next.js**:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
5. Click **"Deploy"**. Your application will be live at `https://campushustle.vercel.app` (or custom subdomain) in under 60 seconds!

### Option 2: Deploy via Vercel CLI
```bash
# Install Vercel CLI globally
npm install -g vercel

# Deploy directly from terminal
vercel
```

---

## 🔒 Security & Admin Access
The Super Administrator portal is located at `/admin` and is restricted to `liliankavengi502@gmail.com`. Ensure you configure any custom environment variables in Vercel under **Project Settings > Environment Variables** if overriding defaults.
