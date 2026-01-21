# Opik SDK Setup

The BloomFlow app includes Opik SDK integration for medical-grade tracking. Currently, the implementation uses a mock/stub that logs to the console.

## Production Setup

To integrate with the actual Opik SDK:

1. Install the Opik SDK package (if available via npm):
```bash
npm install @opik/sdk
```

2. Update `lib/opik.tsx` to use the actual SDK:
   - Replace console.log statements with actual Opik SDK calls
   - Configure API keys and environment settings
   - Set up proper initialization

3. Example integration:
```typescript
import { Opik } from '@opik/sdk';

const opik = new Opik({
  apiKey: process.env.NEXT_PUBLIC_OPIK_API_KEY,
  environment: process.env.NODE_ENV,
});

// Then use:
opik.trace('sensitive', event, data);
opik.compliance(action, details);
opik.safety.incident(incident);
opik.privacy.metric(metric);
```

## Current Implementation

The current implementation provides:
- Separate tracing for sensitive vs non-sensitive data
- Compliance tracking hooks
- Safety incident logging
- Privacy protection metrics

All calls are currently logged to the console for development purposes.
