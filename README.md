# Zintel.in - Gen-Z Unfiltered News & Facts

A data-driven, AI-assisted civic platform that shows verified facts, dashboards, and real-vs-fake news for India.

## 🚀 Features

- **Live Dashboard** - Real-time data visualization with interactive India map
- **Population & Migration** - State-wise demographics and migration patterns  
- **Media Verification** - AI-powered fake news detection with confidence scores
- **Social Community** - Fact-based discussions with verified users
- **Podcasts** - Data-driven insights with Hindi/English transcripts
- **Government Data** - Budget, revenue, and welfare scheme analytics
- **Economy Tracking** - Employment, GDP, and economic indicators
- **Environment Data** - AQI, climate risk, and sustainability metrics

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Database**: SQLite (Prisma ORM)
- **Data Source**: data.gov.in APIs
- **Authentication**: NextAuth.js (Google OAuth + OTP)
- **Charts**: Recharts
- **Maps**: Leaflet

## 📦 Installation

1. **Clone the repository**
   ```bash
   cd "Zintel Website"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   - Copy `.env.local` and fill in your API keys
   - Get Google OAuth credentials from [Google Cloud Console](https://console.cloud.google.com/)
   - Get data.gov.in API key from [https://data.gov.in/](https://data.gov.in/)

4. **Initialize database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run development server**
   ```bash
   npm run dev
   ```

6. **Open browser**
   - Navigate to [http://localhost:3000](http://localhost:3000)

## 🎨 Color Scheme

- Primary Purple: `#5B2D8B`
- Light Purple: `#8E6BBF`
- Verification Green (Real): `#2ECC71`
- Fake/Warning Red: `#E74C3C`
- Misleading Yellow: `#F39C12`
- Background Light: `#F7F8FA`
- Text Dark: `#1F2937`

## 📁 Project Structure

```
Zintel Website/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Homepage
│   ├── population/        # Population & Migration
│   ├── media/             # Media Verification
│   ├── podcasts/          # Podcasts
│   ├── social/            # Social Community
│   └── ...
├── components/
│   ├── layout/            # Navbar, Sidebar, Layout
│   └── ui/                # Reusable UI components
├── prisma/
│   └── schema.prisma      # Database schema
├── public/                # Static assets (logos, images)
└── ...
```

## 🔄 Data Updates

- Data refreshes every **20 minutes** from data.gov.in APIs
- Cached data shown if APIs are unavailable
- "Last Updated" timestamp displayed on all pages

## 🎯 Key Pages

| Page | Route | Description |
|------|-------|-------------|
| Homepage | `/` | Live dashboard with stats & map |
| Population | `/population` | Demographics & migration |
| Podcasts | `/podcasts` | Audio episodes with transcripts |
| Social | `/social` | Community discussions |
| Disclaimer | `/disclaimer` | Data sources & AI disclaimer |

## ✅ Verification System

News articles are labeled with:
- **REAL** (Green) - Verified with official sources
- **FAKE** (Red) - Proven false or misleading
- **MISLEADING** (Yellow) - Partially true but context missing

Each includes:
- Confidence score (0-100%)
- Explanation of verification
- Source attribution

## 🔐 Privacy & Security

- Only last 4 digits of Aadhaar/Voter ID stored (encrypted)
- No full ID numbers retained
- Compliant with Indian data protection laws
- User data never sold or shared

## 📝 Development Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Run production build
npm run lint         # Run ESLint
npx prisma studio    # Open Prisma database viewer
```

## 🚧 Current Status

**Phase 1: ✅ Complete**
- Project setup with Next.js + TypeScript
- Core layout (Sidebar, Navbar)
- Homepage with hero & stats
- Population, Media, Podcasts, Social pages
- Database schema

**Phase 2: 🚧 In Progress**
- Real API integration
- Interactive India map
- Advanced data visualizations
- Authentication system
- News verification backend

## 📄 License

© 2025 Zintel - Gen-Z Unfiltered News & Facts. All rights reserved.

## 🤝 Contributing

This is a production project. For contribution guidelines, please contact the development team.
