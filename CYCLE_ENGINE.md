# Medical-Grade Menstrual Cycle Engine

## Overview

The BloomFlow cycle engine is a medical-grade system that uses evidence-based algorithms to predict cycle phases, analyze health correlations, and provide personalized wellness recommendations.

## Features

### 1. Evidence-Based Phase Detection

**Input Data:**
- Period dates (required)
- 20+ symptoms (optional but improves accuracy)
- Basal body temperature (optional)
- LH test results (optional)

**Algorithm:**
- Statistical prediction based on cycle day and historical patterns
- Machine learning refinement using symptom patterns, BBT, and LH tests
- Confidence intervals for each phase probability

**Output:**
- Phase probabilities (not certainties) with confidence levels
- Confidence intervals for each prediction
- Opik logging of prediction accuracy vs user-reported phases

**Example:**
```
Menstrual: 15.2% (low confidence) [0-30%]
Follicular: 25.8% (medium confidence) [15-35%]
Ovulation: 45.3% (high confidence) [35-55%]
Luteal: 13.7% (low confidence) [5-25%]
```

### 2. Health Metric Correlation Engine

**Sleep Quality Correlation:**
- Analyzes sleep patterns by cycle phase
- Identifies phases with better/worse sleep quality
- Provides correlation strength (weak/moderate/strong)

**Energy Level Prediction:**
- Predicts energy levels based on current phase
- Uses historical data to refine predictions
- Confidence scoring based on data availability

**Symptom Pattern Recognition:**
- PMS detection (luteal phase, days 20-28)
- Ovulation pain (mittelschmerz) recognition
- Menstrual cramps identification
- Energy dip patterns
- Mood swing detection

**Mood Cycle Mapping:**
- Tracks mood trends by phase
- Identifies improving/declining/stable patterns
- Provides phase-specific mood averages

### 3. Personalized Wellness Recommendations

**Workout Intensity by Phase:**
- **Menstrual:** Gentle movement & light exercise
- **Follicular:** Moderate to high intensity training
- **Ovulation:** Peak performance window
- **Luteal:** Moderate intensity with recovery focus

**Nutrition Suggestions:**
- **Menstrual:** Iron-rich foods, magnesium for cramps
- **Follicular:** Balanced macronutrients
- **Ovulation:** Antioxidant-rich foods
- **Luteal:** Complex carbohydrates, B vitamins, calcium & vitamin D

**Stress Management:**
- Phase-specific stress reduction techniques
- Enhanced management during luteal phase
- Regular practices throughout cycle

**Sleep Optimization:**
- Luteal phase: Cool environment, consistent schedule
- General: Sleep hygiene best practices

**All recommendations include:**
- Research citations with DOI/author information
- "Consult your doctor" disclaimers
- Priority levels (high/medium/low)

### 4. Opik Validation Framework

**Daily Validation:**
- "Was our prediction correct?" user feedback
- Tracks prediction accuracy in real-time
- Logs to Opik for continuous improvement

**Weekly Metrics:**
- Symptom prediction accuracy scoring
- Phase prediction accuracy
- Correlation analysis validation

**Monthly Analysis:**
- Cycle regularity scoring
- Pattern recognition accuracy
- Health metric trends

**Quarterly Tracking:**
- Health outcome improvements
- Baseline vs current comparisons
- Intervention effectiveness (A/B testing ready)

## Technical Implementation

### Phase Detection Algorithm

1. **Base Probabilities:** Calculated from cycle day and average cycle length
2. **Symptom Refinement:** Adjusts probabilities based on symptom patterns
3. **BBT Refinement:** Uses temperature patterns to identify ovulation/post-ovulation
4. **LH Test Refinement:** Strong indicator of ovulation when positive
5. **Normalization:** Ensures probabilities sum to 1.0

### Correlation Analysis

- **Pearson Correlation:** Statistical correlation between phases and metrics
- **Pattern Recognition:** Rule-based detection of common patterns
- **Trend Analysis:** Time-series analysis of mood and energy

### Data Storage

- All sensitive data encrypted (AES-256)
- Local-first storage (localForage)
- Audit trails for all access
- Opik logging for validation

## Usage

### Getting Phase Predictions

```typescript
import { CycleEngine } from '@/lib/cycle-engine';

const predictions = CycleEngine.predictPhase(
  cycleHistory,
  targetDate,
  currentSymptoms,
  basalTemp,
  lhTest
);
```

### Analyzing Correlations

```typescript
import { CorrelationEngine } from '@/lib/correlation-engine';

const sleepCorr = CorrelationEngine.analyzeSleepCorrelation(
  healthMetrics,
  phaseHistory
);
```

### Getting Recommendations

```typescript
import { RecommendationEngine } from '@/lib/recommendation-engine';

const recommendations = RecommendationEngine.getAllRecommendations(phase);
```

### Validation

```typescript
import { OpikValidation } from '@/lib/opik-validation';

await OpikValidation.logDailyFeedback(
  predictions,
  actualPhase,
  opik
);
```

## Medical Disclaimers

**Critical:** All predictions are probability estimates, not certainties. Individual cycles vary significantly.

**Always consult your healthcare provider:**
- Before making significant lifestyle changes
- If you experience severe symptoms
- For medical concerns or questions
- Before starting new supplements or exercise programs

## Research Citations

All recommendations cite peer-reviewed research with:
- Author names
- Journal/publication
- Year
- DOI when available

## Future Enhancements

- Machine learning model training with user data
- Integration with wearable devices (temperature, heart rate)
- Advanced pattern recognition using neural networks
- Multi-cycle prediction models
- Personalized baseline adjustments
