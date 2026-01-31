# BloomFlow

A **cycle-conscious** femtech app that helps women understand and predict the best times to workout. BloomFlow tracks your menstrual phase, sleep, nutrition, movement, and stress—then uses **Opik AI** to recommend when to train, rest, or push, so you can align your fitness with your body instead of working against it.

Built with Next.js 14, designed for privacy, security, and medical-grade data handling.

## What BloomFlow Does

### 🌿 Cycle-Aware Fitness Coach

BloomFlow turns your menstrual cycle from a workout hurdle into a **personalized training advantage**. While other apps treat the cycle as a siloed "cycle insights" tab, BloomFlow treats it as the **central operating system** for your wellness—connecting how your cycle affects your energy, recovery, and performance.

**What we track:**
- **Menstrual phase** — Menstrual, follicular, ovulation, luteal
- **Sleep** — Quality and duration
- **Nutrition** — What you eat and how it supports your goals
- **Movement** — Exercise and daily activity
- **Stress** — Mood and stress levels

**How we use it:**
- Predict when the **best times to work out** are for your body
- Recommend workout intensity and type based on your phase and garden data
- Use **Opik AI** to continuously refine recommendations with enterprise-grade observability
- Provide generic workout tips plus **tailored plans** based on your cycle phase and Body Garden (sleep, nutrition, movement, stress)

### 🪙 Body Garden & Coin Cottage

- **Body Garden** — Gamified health tracking where plants grow as you log sleep, nutrition, movement, and stress. A calendar shows dates colored by cycle phase; tap a date to complete a daily questionnaire.
- **Coin Cottage** — Earn coins when you add information in the Body Garden and when plants level up. Use coins in the Focus Factory to play games (coming soon). Social accountability feature lets you add friends and keep each other on track.
- **Focus Factory** — AI-powered insights and games (coming soon), powered by coins earned from the Body Garden.

### 🔒 HIPAA-Inspired Data Architecture

- **Local-first storage** — Sensitive data stored locally using localForage
- **End-to-end encryption** — AES-256 encryption for health metrics
- **Opik medical-grade tracking** — Separate tracing for sensitive vs non-sensitive data, compliance tracking, safety incident logging
- **Medical disclaimer** — Persistent banner (dismissible); not a substitute for professional medical advice

### 🎨 Femtech-Focused Design

- Soft but professional color palette (medical credibility + feminine appeal)
- Educational cycle phase explanations (menstrual, follicular, ovulation, luteal)
- Cycle-colored calendar and phase-aware recommendations
- Dismissible medical disclaimer banner

## Tech Stack

- **Next.js 14** — React framework with App Router
- **TypeScript** — Type-safe development
- **Tailwind CSS** — Utility-first styling
- **Opik SDK** — Medical-grade tracking and AI recommendation refinement
- **localForage** — Offline-first local storage
- **crypto-js** — Encryption utilities
- **recharts** — Data visualization
- **date-fns** — Date manipulation
- **lucide-react** — Icon library

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
npm start
```

## Project Structure

```
BloomFlow/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Main dashboard (The Grove)
│   ├── garden/            # Body Garden page
│   ├── cottage/           # Coin Cottage page
│   ├── factory/           # Focus Factory page
│   ├── about/             # About BloomFlow
│   └── globals.css        # Global styles
├── components/
│   ├── BodyGarden.tsx     # Garden gamification, Activity Logger
│   ├── GardenCalendar.tsx # Phase-colored calendar, daily questionnaire
│   ├── CoinCottageBalance.tsx
│   ├── CottageSocialAccountability.tsx
│   ├── CottageWorkoutPlans.tsx
│   ├── CycleVisualization.tsx
│   ├── SymptomTracker.tsx
│   ├── StyledMedicalDisclaimer.tsx
│   └── ...
├── lib/
│   ├── cycle-engine.ts    # Phase prediction (menstrual, follicular, ovulation, luteal)
│   ├── game-engine.ts     # Body Garden logic, coins, growth
│   ├── recommendation-engine.ts  # Workout/nutrition/stress/sleep recommendations by phase
│   ├── opik.tsx           # Opik SDK integration
│   ├── encryption.ts      # Data encryption
│   └── ...
└── package.json
```

## Privacy & Security

- All sensitive data is encrypted at rest
- Local-first architecture means data stays on your device
- Opik powers enterprise-grade observability and recommendation refinement
- No data sent to servers without explicit consent
- Medical disclaimer: not a substitute for professional medical advice

## Medical Disclaimer

**Important**: This application is not a substitute for professional medical advice, diagnosis, or treatment. Always consult your healthcare provider for medical concerns.

## License

This project is private and proprietary.
