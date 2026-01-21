/**
 * Health Education Content
 * Research-backed educational content for game mechanics
 */

export interface Discovery {
  id: string;
  title: string;
  content: string;
  category: 'cycle-health' | 'nutrition' | 'sleep' | 'movement' | 'stress' | 'general';
  sources: Array<{
    title: string;
    authors?: string;
    journal?: string;
    year?: number;
    doi?: string;
  }>;
  unlockedAt: string; // Condition description
}

export interface PlantLabel {
  zone: 'sleep' | 'nutrition' | 'movement' | 'stress';
  title: string;
  description: string;
  healthBenefit: string;
  researchNote: string;
}

/**
 * Health Education Content
 */
export class HealthEducation {
  /**
   * Get all discoveries
   */
  static getDiscoveries(): Discovery[] {
    return [
      {
        id: 'garden-basics',
        title: 'Welcome to Your Body Garden',
        content: 'Your Body Garden represents different aspects of your health. Each zone - Sleep, Nutrition, Movement, and Stress - grows with your consistent care. Remember: plants don\'t die from missed days, they just rest. This reflects how your body works - rest is part of growth.',
        category: 'general',
        sources: [
          {
            title: 'The importance of rest in health',
            authors: 'National Sleep Foundation',
            year: 2020,
          },
        ],
        unlockedAt: 'Reach total level 10',
      },
      {
        id: 'cycle-awareness',
        title: 'Your Cycle Affects Your Garden',
        content: 'Just like real gardens have seasons, your Body Garden responds to your menstrual cycle. During your follicular phase (days 1-13), you may notice faster growth - this is your "fertile soil" period when energy is high. During menstruation, growth may slow - this is "resting soil" and that\'s perfectly healthy.',
        category: 'cycle-health',
        sources: [
          {
            title: 'Menstrual cycle and energy levels',
            authors: 'Hackney AC',
            journal: 'Sports Med',
            year: 1990,
            doi: '10.2165/00007256-199010030-00004',
          },
        ],
        unlockedAt: 'Reach total level 25',
      },
      {
        id: 'fertile-soil',
        title: 'Fertile Soil Days',
        content: 'You\'re in your ovulation phase - this is when your body has peak energy and hormonal support. Your garden grows faster during these "fertile soil" days. This is a great time for activities that require more energy, but remember: listening to your body is always the priority.',
        category: 'cycle-health',
        sources: [
          {
            title: 'Hormonal contraceptive use and physical performance',
            authors: 'Elliott-Sale KJ et al.',
            journal: 'Sports Med',
            year: 2020,
            doi: '10.1007/s40279-020-01317-5',
          },
        ],
        unlockedAt: 'Experience ovulation phase',
      },
      {
        id: 'resting-soil',
        title: 'Resting Soil - A Time for Gentle Care',
        content: 'You\'re in your menstrual phase. This is "resting soil" - a time when your body needs more rest and gentle care. Your garden may grow more slowly, and that\'s not only okay, it\'s healthy. Resting is a form of growth. Gentle activities like walking, stretching, or meditation are perfect for this phase.',
        category: 'cycle-health',
        sources: [
          {
            title: 'Exercise for dysmenorrhoea',
            authors: 'Armour M, Smith CA',
            journal: 'Cochrane Database Syst Rev',
            year: 2019,
            doi: '10.1002/14651858.CD004142.pub4',
          },
        ],
        unlockedAt: 'Experience menstrual phase',
      },
      {
        id: 'consistency',
        title: 'The Power of Consistency',
        content: 'You\'ve maintained a 7-day streak! Consistency in health habits is more valuable than perfection. Research shows that regular, moderate activity is more beneficial than sporadic intense efforts. Your garden reflects this - steady care creates thriving plants.',
        category: 'general',
        sources: [
          {
            title: 'Consistency in health behaviors',
            authors: 'Kwasnicka D et al.',
            journal: 'Health Psychol Rev',
            year: 2016,
            doi: '10.1080/17437199.2016.1190263',
          },
        ],
        unlockedAt: 'Maintain 7-day streak',
      },
      {
        id: 'listening-to-body',
        title: 'Listening to Your Body is Wisdom',
        content: 'You chose to rest when your body needed it. This is not failure - it\'s wisdom. Your garden rewards this choice because self-awareness and self-care are the foundation of health. Research shows that pushing through when you need rest can be counterproductive.',
        category: 'general',
        sources: [
          {
            title: 'The importance of rest and recovery',
            authors: 'Kellmann M, Bertollo M',
            journal: 'Int J Sports Physiol Perform',
            year: 2018,
            doi: '10.1123/ijspp.2017-0420',
          },
        ],
        unlockedAt: 'Choose "listened to body" outcome',
      },
    ];
  }

  /**
   * Get plant labels (educational tooltips)
   */
  static getPlantLabels(): PlantLabel[] {
    return [
      {
        zone: 'sleep',
        title: 'Sleep Garden',
        description: 'Your sleep garden grows with consistent sleep patterns. Quality sleep is foundational to all other health metrics.',
        healthBenefit: 'Research shows that consistent sleep schedules support hormone regulation, mood stability, and immune function.',
        researchNote: 'Baker FC, Driver HS. Sleep and the menstrual cycle. Sleep Med Rev. 2007.',
      },
      {
        zone: 'nutrition',
        title: 'Nutrition Plot',
        description: 'Your nutrition plot blooms when you nourish your body with balanced meals. Different cycle phases have different nutritional needs.',
        healthBenefit: 'Adequate nutrition supports energy levels, mood regulation, and cycle health. Iron during menstruation, complex carbs during luteal phase.',
        researchNote: 'Gorczyca AM et al. Nutrition and the menstrual cycle. Curr Nutr Rep. 2016.',
      },
      {
        zone: 'movement',
        title: 'Movement Meadow',
        description: 'Your movement meadow thrives with regular physical activity. The type and intensity can vary with your cycle phase.',
        healthBenefit: 'Regular movement supports cardiovascular health, mood, and energy. Adjusting intensity by cycle phase can optimize benefits.',
        researchNote: 'McNulty KL et al. The effect of menstrual cycle phase on physical performance. Sports Med. 2020.',
      },
      {
        zone: 'stress',
        title: 'Stress Sanctuary',
        description: 'Your stress sanctuary features calm water elements that grow with stress management practices like meditation, breathing, or gentle movement.',
        healthBenefit: 'Stress management supports hormone balance, sleep quality, and overall well-being. The luteal phase may require extra attention to stress.',
        researchNote: 'Harlow SD et al. Stress and the menstrual cycle. Am J Epidemiol. 1995.',
      },
    ];
  }

  /**
   * Get discovery by ID
   */
  static getDiscovery(id: string): Discovery | undefined {
    return this.getDiscoveries().find(d => d.id === id);
  }

  /**
   * Get plant label by zone
   */
  static getPlantLabel(zone: PlantLabel['zone']): PlantLabel | undefined {
    return this.getPlantLabels().find(l => l.zone === zone);
  }

  /**
   * Get tooltip content for a plant
   */
  static getPlantTooltip(plant: { zone: PlantLabel['zone']; level: number; health: string }): string {
    const label = this.getPlantLabel(plant.zone);
    if (!label) return '';

    let tooltip = `${label.title}\n\n${label.description}\n\n`;
    tooltip += `Health Benefit: ${label.healthBenefit}\n\n`;
    tooltip += `Current Level: ${plant.level}/10\n`;
    tooltip += `Status: ${plant.health}\n\n`;
    tooltip += `Research: ${label.researchNote}`;

    return tooltip;
  }
}
