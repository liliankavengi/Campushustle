#  CampusHustle — Kenya Campus Money App

**CampusHustle** is a Next.js 14 web app that helps Kenyan university students earn income, manage their HELB runway, and access verified gig opportunities — all from campus.

---

##  Features

- **Global Remote Gigs** — Worldwide AI annotation, freelance, and tech tasks (Alignerr, DataAnnotation, Outlier.ai, Mindrift, OneForma, Clickworker)
- **Kenyan Remote Jobs** — Local job portals (Fuzu, BrighterMonday, MyJobMag) with remote application
-  **Campus Escrow Gigs** — Post and accept student tasks with M-Pesa escrow protection
- **PayHero M-Pesa Payments** — KSh 130 / semester subscription via M-Pesa STK push
- **USD-denominated gig rewards** with KES equivalent display
- **HELB Runway Calculator** — Track your semester balance and daily burn rate
- **Dark + Light Mode** — Full theme support across all pages
- **Mobile-First Responsive Design** — Works on smartphone and laptop
- **Live Task Feed** — Auto-updating gig board with real timestamps
- **Admin Dashboard** — Student registry, revenue metrics, subscription management

---

## Getting Started

```bash
# Clone the repo
git clone https://github.com/liliankavengi/Campushustle.git
cd Campushustle

# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view it.

---

## 💳 PayHero M-Pesa Integration Setup

To enable live M-Pesa payments, you need a **PayHero Kenya** account:

### Step 1: Sign Up on PayHero
1. Go to [https://payhero.co.ke](https://payhero.co.ke)
2. Create a business account (free to sign up)

### Step 2: Get Your API Credentials
1. Log into the PayHero Dashboard
2. Navigate to **Settings → API Keys**
3. Generate your **API Key** and **API Secret**

### Step 3: Link Your Payment Channel
1. In PayHero Dashboard, go to **Payment Channels**
2. Add your **Paybill**, **Till (Buy Goods)**, or M-Pesa mobile number
3. Copy the **Channel ID** shown after linking

### Step 4: Configure Environment Variables
Create a `.env.local` file with:

```env
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app

# PayHero credentials (from PayHero Dashboard > Settings > API Keys)
PAYHERO_API_KEY=your_api_key_here
PAYHERO_API_SECRET=your_api_secret_here
PAYHERO_CHANNEL_ID=your_channel_id_here
PAYHERO_CALLBACK_URL=https://your-domain.vercel.app/api/payhero/callback

# Admin email
NEXT_PUBLIC_ADMIN_EMAIL=your-email@example.com
```

### What You Need from PayHero
| Credential | Where to Find | Required |
|---|---|---|
| API Key | Dashboard → Settings → API Keys |  Yes |
| API Secret | Dashboard → Settings → API Keys |  Yes |
| Channel ID | Dashboard → Payment Channels |  Yes |
| Callback URL | Set to your Vercel URL + `/api/payhero/callback` |  Yes |

**Subscription Price**: KSh 130 / semester (configurable in `MpesaModal.tsx`)

---

##  Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/liliankavengi/Campushustle)

1. Push to GitHub (already done)
2. Import the repo at [vercel.com/new](https://vercel.com/new)
3. Add your environment variables in Vercel Dashboard → Settings → Environment Variables
4. Deploy!

---

##  Project Structure

```
src/
├── app/
│   ├── page.tsx           # Landing page (sign-up gate)
│   ├── app/page.tsx       # Main student dashboard
│   ├── admin/page.tsx     # Admin dashboard
│   ├── auth/page.tsx      # Auth page
│   └── api/
│       ├── payhero/stk/   # PayHero M-Pesa STK push
│       └── payhero/callback/ # PayHero webhook handler
├── components/
│   ├── GigBoard.tsx       # Gig listings (Global + Kenyan + Escrow)
│   ├── MpesaModal.tsx     # PayHero payment modal
│   ├── EscrowModal.tsx    # Post campus gig with escrow
│   └── ...
├── lib/
│   ├── store.ts           # App state management
│   └── mockData.ts        # Initial gig + user data
└── types/
    └── index.ts           # TypeScript interfaces
```

---

## Gig Categories

| Category | Examples | Currency |
|---|---|---|
| Global Remote | Alignerr, DataAnnotation, Outlier.ai | USD ($) |
| Kenyan Remote | Fuzu Kenya, BrighterMonday | USD ($) |
| AI Annotation | Outlier.ai, Mindrift | USD ($) |
| Campus Escrow | Student-to-student tasks | USD ($) |
| Attachment & Internship | Safaricom, tech firms | USD ($) |

**Subscription**: KSh 130/semester (paid via PayHero M-Pesa)

---

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Payments**: PayHero Kenya (M-Pesa STK Push)
- **Hosting**: Vercel
- **State**: React useState (custom store pattern)
