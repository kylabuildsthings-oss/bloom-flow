/**
 * Symptom severity escalation detection and red flag recognition
 */

export type SymptomSeverity = 'none' | 'mild' | 'moderate' | 'severe' | 'critical';

export interface Symptom {
  id: string;
  name: string;
  severity: SymptomSeverity;
  category: 'pain' | 'bleeding' | 'mood' | 'digestive' | 'other';
  notes?: string;
  timestamp: Date;
}

export interface RedFlagSymptom {
  symptom: string;
  severity: SymptomSeverity;
  description: string;
  recommendedAction: 'monitor' | 'consult' | 'urgent' | 'emergency';
}

/**
 * Red flag symptoms that require immediate attention
 */
const RED_FLAG_SYMPTOMS: Record<string, RedFlagSymptom> = {
  severe_bleeding: {
    symptom: 'Severe Bleeding',
    severity: 'critical',
    description: 'Excessive bleeding that soaks through a pad/tampon in less than an hour',
    recommendedAction: 'emergency',
  },
  severe_pain: {
    symptom: 'Severe Pelvic Pain',
    severity: 'critical',
    description: 'Intense pain that interferes with daily activities',
    recommendedAction: 'urgent',
  },
  fever_with_pain: {
    symptom: 'Fever with Pelvic Pain',
    severity: 'critical',
    description: 'Fever above 101°F (38.3°C) accompanied by pelvic pain',
    recommendedAction: 'emergency',
  },
  dizziness_fainting: {
    symptom: 'Dizziness or Fainting',
    severity: 'critical',
    description: 'Feeling lightheaded, dizzy, or fainting',
    recommendedAction: 'urgent',
  },
  chest_pain: {
    symptom: 'Chest Pain',
    severity: 'critical',
    description: 'Chest pain or difficulty breathing',
    recommendedAction: 'emergency',
  },
  persistent_nausea: {
    symptom: 'Persistent Nausea/Vomiting',
    severity: 'severe',
    description: 'Unable to keep fluids down for more than 24 hours',
    recommendedAction: 'urgent',
  },
};

/**
 * Detect red flag symptoms
 */
export function detectRedFlags(symptoms: Symptom[]): RedFlagSymptom[] {
  const redFlags: RedFlagSymptom[] = [];

  symptoms.forEach(symptom => {
    // Check for severe bleeding
    if (symptom.category === 'bleeding' && symptom.severity === 'severe') {
      redFlags.push(RED_FLAG_SYMPTOMS.severe_bleeding);
    }

    // Check for severe pain
    if (symptom.category === 'pain' && symptom.severity === 'severe') {
      redFlags.push(RED_FLAG_SYMPTOMS.severe_pain);
    }

    // Check for critical severity
    if (symptom.severity === 'critical') {
      redFlags.push({
        symptom: symptom.name,
        severity: 'critical',
        description: `Critical symptom: ${symptom.name}`,
        recommendedAction: 'emergency',
      });
    }
  });

  // Check for combinations
  const hasFever = symptoms.some(s => s.name.toLowerCase().includes('fever'));
  const hasPain = symptoms.some(s => s.category === 'pain' && s.severity !== 'none');
  
  if (hasFever && hasPain) {
    redFlags.push(RED_FLAG_SYMPTOMS.fever_with_pain);
  }

  return [...new Map(redFlags.map(flag => [flag.symptom, flag])).values()];
}

/**
 * Detect severity escalation
 */
export function detectSeverityEscalation(
  currentSymptoms: Symptom[],
  previousSymptoms: Symptom[]
): boolean {
  const currentMaxSeverity = getMaxSeverity(currentSymptoms);
  const previousMaxSeverity = getMaxSeverity(previousSymptoms);

  const severityLevels: Record<SymptomSeverity, number> = {
    none: 0,
    mild: 1,
    moderate: 2,
    severe: 3,
    critical: 4,
  };

  return severityLevels[currentMaxSeverity] > severityLevels[previousMaxSeverity];
}

function getMaxSeverity(symptoms: Symptom[]): SymptomSeverity {
  if (symptoms.length === 0) return 'none';
  
  const severityLevels: SymptomSeverity[] = ['none', 'mild', 'moderate', 'severe', 'critical'];
  let maxIndex = 0;
  
  symptoms.forEach(symptom => {
    const index = severityLevels.indexOf(symptom.severity);
    if (index > maxIndex) {
      maxIndex = index;
    }
  });
  
  return severityLevels[maxIndex];
}

/**
 * Get emergency resources based on severity
 */
export function getEmergencyResources(severity: SymptomSeverity): {
  title: string;
  resources: Array<{ name: string; contact: string; description: string }>;
} {
  const baseResources = [
    {
      name: 'Emergency Services',
      contact: '911',
      description: 'Call for life-threatening emergencies',
    },
    {
      name: 'National Suicide Prevention Lifeline',
      contact: '988',
      description: '24/7 crisis support',
    },
  ];

  if (severity === 'critical') {
    return {
      title: 'Immediate Medical Attention Required',
      resources: [
        ...baseResources,
        {
          name: 'Poison Control',
          contact: '1-800-222-1222',
          description: '24/7 poison emergency help',
        },
      ],
    };
  }

  if (severity === 'severe') {
    return {
      title: 'Urgent Care Recommended',
      resources: [
        ...baseResources,
        {
          name: 'Nurse Line',
          contact: 'Check with your insurance',
          description: '24/7 nurse consultation',
        },
      ],
    };
  }

  return {
    title: 'Consult Your Healthcare Provider',
    resources: baseResources,
  };
}
