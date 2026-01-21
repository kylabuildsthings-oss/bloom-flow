# BloomFlow

A HIPAA-inspired health tracking application built with Next.js 14, designed specifically for femtech with a focus on privacy, security, and medical-grade data handling.

## Features

### 🔒 HIPAA-Inspired Data Architecture
- **Local-first storage**: All sensitive data stored locally using localForage
- **End-to-end encryption**: AES-256 encryption for health metrics
- **Consent flows**: Clear, granular consent management for data sharing
- **Audit trails**: Comprehensive logging of all data access

### ⚠️ Medical Disclaimer System
- Persistent disclaimer banner
- Symptom severity escalation detection
- Red flag symptom recognition with Opik logging
- Emergency resource suggestions

### 📊 Opik Medical-Grade Tracking
- Separate tracing for sensitive vs non-sensitive data
- Compliance tracking for medical guidelines
- Safety incident logging and alerting
- Privacy protection metrics

### 🎨 Femtech-Focused Design
- Soft but professional color palette (medical credibility + feminine appeal)
- Educational cycle visualization
- Clinical symptom tracking
- Healthcare provider-ready progress reports

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Opik SDK** - Medical-grade tracking and compliance
- **localForage** - Offline-first local storage
- **crypto-js** - Encryption utilities
- **recharts** - Data visualization
- **date-fns** - Date manipulation
- **lucide-react** - Icon library

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
│   ├── page.tsx           # Main dashboard
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── MedicalDisclaimer.tsx
│   ├── CycleVisualization.tsx
│   ├── SymptomTracker.tsx
│   ├── ProgressReport.tsx
│   ├── ConsentFlow.tsx
│   └── AuditTrail.tsx
├── lib/                   # Core libraries
│   ├── encryption.ts      # Data encryption
│   ├── storage.ts         # Local storage management
│   ├── audit.ts           # Audit trail system
│   ├── opik.tsx           # Opik SDK integration
│   └── symptom-detection.ts # Symptom analysis
└── package.json
```

## Key Features Explained

### Data Encryption
All sensitive health data (cycle data, symptoms) is encrypted using AES-256 before storage. Encryption keys are managed locally.

### Audit Trail
Every data access, modification, and consent change is logged with timestamps and details for compliance purposes.

### Symptom Detection
The app automatically detects:
- Red flag symptoms requiring immediate attention
- Severity escalation patterns
- Emergency situations

### Consent Management
Users can grant or revoke consent for:
- Data collection
- Data sharing with healthcare providers
- Analytics usage
- Cloud backup

## Privacy & Security

- All sensitive data is encrypted at rest
- Local-first architecture means data stays on your device
- Clear consent flows for all data usage
- Comprehensive audit trails for transparency
- No data sent to servers without explicit consent

## Medical Disclaimer

**Important**: This application is not a substitute for professional medical advice, diagnosis, or treatment. Always consult your healthcare provider for medical concerns.

## License

This project is private and proprietary.
