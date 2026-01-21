# Body Garden - Health Gamification System

## Overview

The Body Garden is a medically responsible gamification system that makes health tracking engaging without creating guilt, obsession, or unhealthy patterns. It uses a garden metaphor where different health zones grow based on user activities.

## Core Principles

### 1. No Guilt Mechanics
- **Plants don't die**: Missed days don't kill plants, they just rest
- **Rest is growth**: Choosing to rest is rewarded equally to completing activities
- **No penalties**: There are no negative consequences for taking breaks

### 2. Effort-Based Rewards
- Rewards are based on **effort**, not outcomes
- "Listened to my body" gets equal or better rewards than "completed activity"
- Low-intensity activities still count - effort is effort

### 3. Cycle-Aware Mechanics
- **Fertile Soil Days** (Follicular/Ovulation): Higher growth multipliers (1.2x - 1.5x)
- **Resting Soil Days** (Menstrual): Lower growth (0.8x) - this is healthy and expected
- **Balanced Soil** (Luteal): Normal growth (1.0x)
- Seasonal changes reflect cycle completion

### 4. Streak Protection
- **Greenhouse Mode**: Protects streaks during travel, illness, or needed breaks
- Streaks don't reset immediately - grace period built in
- No pressure to maintain streaks at the cost of health

## Garden Zones

### Sleep Garden 🌙
- Grows with consistent sleep patterns
- Visual: Moon phases and stars
- Educational: Sleep and cycle health research

### Nutrition Plot 🌻
- Blooms with balanced nutrition
- Visual: Flowers and plants
- Educational: Phase-specific nutritional needs

### Movement Meadow 🌳
- Trees grow with physical activity
- Visual: Trees of varying sizes
- Educational: Exercise and cycle phase optimization

### Stress Sanctuary 💧
- Calm water features grow with stress management
- Visual: Water elements
- Educational: Stress management and hormone balance

## Growth Mechanics

### Base Growth
- Base growth rate: 5 points per activity
- Effort points calculated from:
  - Activity type
  - Duration (capped bonus)
  - Intensity (low/medium/high - all count!)

### Phase Multipliers
- **Menstrual**: 0.8x (resting soil - gentle care)
- **Follicular**: 1.2x (fertile soil - optimal growth)
- **Ovulation**: 1.5x (peak fertile soil - maximum growth)
- **Luteal**: 1.0x (balanced soil - steady growth)

### Outcome Bonuses
- **Listened to Body**: 1.2x bonus (self-care is wisdom)
- **Completed Activity**: 1.0x (normal growth)
- **Rested**: 1.0x (rest is valid growth)

## Progression System

### Plant Levels
- Levels 0-10 for each plant
- Growth percentage (0-100%) to next level
- Visual changes as plants level up

### Plant Health States
- **Thriving**: Recently cared for (0 days since care)
- **Healthy**: Normal state (1-2 days)
- **Needs Care**: 2+ days since care (gentle reminder)
- **Resting**: 3+ days (not dying, just resting)

### Total Garden Level
- Sum of all plant levels
- Visual progress bar
- Unlocks discoveries at milestones

## Discovery System

### Educational Content Unlocks
- **Garden Basics**: Unlocked at total level 10
- **Cycle Awareness**: Unlocked at total level 25
- **Fertile Soil**: Unlocked during ovulation phase
- **Resting Soil**: Unlocked during menstrual phase
- **Consistency**: Unlocked at 7-day streak
- **Listening to Body**: Unlocked when choosing rest

### Discovery Content
- Research-backed information
- Citations with authors, journals, DOIs
- Educational tooltips throughout
- No pressure to unlock - natural progression

## Opik Engagement Analytics

### Tracked Metrics
- Daily active users
- Average session duration
- Most engaging zones
- Reward schedule effectiveness
- Unhealthy pattern detection

### Unhealthy Pattern Detection
- **Obsession**: Excessive daily activity (>20 activities/week)
- **Guilt**: Multiple rest days with negative sentiment
- **Over-exertion**: Consistently high effort points
- **Neglect**: Extended periods without activity (gentle reminder)

### A/B Testing
- Different reward schedules
- Engagement rate tracking
- Retention analysis
- Health improvement correlation

## Health Education Integration

### Plant Labels
- Interactive tooltips on each plant
- Health benefits explained
- Research citations
- Cycle-specific information

### Research-Backed Content
- All educational content cites sources
- Authors, journals, years, DOIs provided
- Medical disclaimers included
- "Consult your doctor" reminders

## Safe Design Features

### No Negative Reinforcement
- No plant death animations
- No guilt-inducing messages
- No punishment for rest
- No comparison to others

### Positive Messaging
- "You listened to your body - that's wisdom!"
- "Rest is growth too"
- "Your garden appreciates gentle care"
- Celebration of self-awareness

### Medical Responsibility
- All recommendations include disclaimers
- Research citations provided
- Encourages consulting healthcare providers
- No medical advice, just education

## Technical Implementation

### Game Engine
- `lib/game-engine.ts`: Core game mechanics
- `lib/game-storage.ts`: State persistence
- `lib/health-education.ts`: Educational content
- `lib/opik-engagement.ts`: Analytics tracking

### Components
- `components/BodyGarden.tsx`: Main garden view
- `components/ActivityLogger.tsx`: Activity logging interface

### Data Storage
- Garden state: Non-sensitive (encrypted in transit)
- Activity logs: Sensitive (encrypted at rest)
- Discoveries: Non-sensitive
- All access logged in audit trail

## Usage Example

```typescript
// Log an activity
await logActivity(
  'movement',           // zone
  '30 min walk',        // activity
  'completed-activity', // outcome
  30,                   // duration (minutes)
  'medium'              // intensity
);

// Enable greenhouse mode (streak protection)
await enableGreenhouse(7); // 7 days of protection

// Check discoveries
const discoveries = GameEngine.checkDiscoveries(gardenState, currentPhase);
```

## Best Practices

1. **Log activities honestly** - All outcomes are valid
2. **Use greenhouse mode** when needed - No guilt
3. **Read discoveries** - Educational content is valuable
4. **Focus on effort** - Not perfection
5. **Listen to your body** - It's always the right choice

## Medical Disclaimers

**Important**: The Body Garden is a gamification tool, not medical advice. Always consult your healthcare provider for medical concerns. The game mechanics are designed to support health tracking, not replace professional medical guidance.

## Future Enhancements

- Social features (optional, privacy-first)
- Custom plant varieties
- Seasonal themes
- Integration with wearables
- Advanced pattern recognition
- Personalized recommendations based on garden state
