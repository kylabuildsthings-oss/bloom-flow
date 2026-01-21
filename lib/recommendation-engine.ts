/**
 * Personalized Wellness Recommendations Engine
 * Evidence-based recommendations with citations
 */

import { CyclePhase } from './cycle-engine';

export interface Recommendation {
  id: string;
  category: 'workout' | 'nutrition' | 'stress' | 'sleep';
  title: string;
  description: string;
  phase: CyclePhase;
  priority: 'high' | 'medium' | 'low';
  citations: Citation[];
  disclaimer: string;
}

export interface Citation {
  title: string;
  authors?: string;
  journal?: string;
  year?: number;
  url?: string;
  doi?: string;
}

/**
 * Evidence-based wellness recommendations by cycle phase
 */
export class RecommendationEngine {
  /**
   * Get workout intensity recommendations by phase
   */
  static getWorkoutRecommendations(phase: CyclePhase): Recommendation[] {
    const recommendations: Recommendation[] = [];

    switch (phase) {
      case 'menstrual':
        recommendations.push({
          id: 'workout-menstrual-1',
          category: 'workout',
          title: 'Gentle Movement & Light Exercise',
          description: 'During menstruation, focus on gentle activities like yoga, walking, or light stretching. Research suggests that moderate exercise can help reduce menstrual pain.',
          phase: 'menstrual',
          priority: 'high',
          citations: [
            {
              title: 'Exercise for dysmenorrhoea',
              authors: 'Armour M, Smith CA',
              journal: 'Cochrane Database Syst Rev',
              year: 2019,
              doi: '10.1002/14651858.CD004142.pub4',
            },
          ],
          disclaimer: 'Consult your doctor before starting any exercise program, especially if you experience severe menstrual pain.',
        });
        break;

      case 'follicular':
        recommendations.push({
          id: 'workout-follicular-1',
          category: 'workout',
          title: 'Moderate to High Intensity Training',
          description: 'The follicular phase (days 1-13) is ideal for building strength and endurance. Estrogen levels are rising, which may support better performance and recovery.',
          phase: 'follicular',
          priority: 'high',
          citations: [
            {
              title: 'The effect of the menstrual cycle on exercise metabolism',
              authors: 'Hackney AC',
              journal: 'Sports Med',
              year: 1990,
              doi: '10.2165/00007256-199010030-00004',
            },
          ],
          disclaimer: 'Individual responses vary. Consult your doctor or trainer for personalized exercise recommendations.',
        });
        break;

      case 'ovulation':
        recommendations.push({
          id: 'workout-ovulation-1',
          category: 'workout',
          title: 'Peak Performance Window',
          description: 'Ovulation is associated with peak performance potential. This is an excellent time for high-intensity workouts, strength training, or athletic competitions.',
          phase: 'ovulation',
          priority: 'high',
          citations: [
            {
              title: 'Hormonal contraceptive use and physical performance',
              authors: 'Elliott-Sale KJ et al.',
              journal: 'Sports Med',
              year: 2020,
              doi: '10.1007/s40279-020-01317-5',
            },
          ],
          disclaimer: 'Listen to your body. If you experience ovulation pain (mittelschmerz), reduce intensity. Consult your doctor if pain is severe.',
        });
        break;

      case 'luteal':
        recommendations.push({
          id: 'workout-luteal-1',
          category: 'workout',
          title: 'Moderate Intensity with Recovery Focus',
          description: 'During the luteal phase, progesterone levels rise and core temperature increases. Focus on moderate-intensity workouts and prioritize recovery. Reduce intensity if experiencing PMS symptoms.',
          phase: 'luteal',
          priority: 'medium',
          citations: [
            {
              title: 'The effect of menstrual cycle phase on physical performance',
              authors: 'McNulty KL et al.',
              journal: 'Sports Med',
              year: 2020,
              doi: '10.1007/s40279-020-01319-3',
            },
          ],
          disclaimer: 'Individual responses to exercise during the luteal phase vary. Consult your doctor if you experience significant changes in performance or symptoms.',
        });
        break;
    }

    return recommendations;
  }

  /**
   * Get nutrition recommendations by phase
   */
  static getNutritionRecommendations(phase: CyclePhase): Recommendation[] {
    const recommendations: Recommendation[] = [];

    switch (phase) {
      case 'menstrual':
        recommendations.push(
          {
            id: 'nutrition-menstrual-1',
            category: 'nutrition',
            title: 'Iron-Rich Foods',
            description: 'During menstruation, iron loss occurs through blood. Include iron-rich foods like lean red meat, spinach, lentils, and fortified cereals. Pair with vitamin C to enhance absorption.',
            phase: 'menstrual',
            priority: 'high',
            citations: [
              {
                title: 'Iron deficiency in women',
                authors: 'Milman N',
                journal: 'Ann Hematol',
                year: 2011,
                doi: '10.1007/s00277-011-1145-8',
              },
            ],
            disclaimer: 'Consult your doctor before taking iron supplements, especially if you have a history of iron overload or hemochromatosis.',
          },
          {
            id: 'nutrition-menstrual-2',
            category: 'nutrition',
            title: 'Magnesium for Cramp Relief',
            description: 'Magnesium may help reduce menstrual cramps. Include magnesium-rich foods like dark chocolate, nuts, seeds, and leafy greens.',
            phase: 'menstrual',
            priority: 'medium',
            citations: [
              {
                title: 'Magnesium supplementation in the treatment of dysmenorrhea',
                authors: 'Parazzini F et al.',
                journal: 'Obstet Gynecol',
                year: 2017,
                doi: '10.1097/AOG.0000000000001954',
              },
            ],
            disclaimer: 'Consult your doctor before taking magnesium supplements, especially if you have kidney disease.',
          }
        );
        break;

      case 'follicular':
        recommendations.push({
          id: 'nutrition-follicular-1',
          category: 'nutrition',
          title: 'Balanced Macronutrients',
          description: 'During the follicular phase, focus on a balanced diet with adequate protein, complex carbohydrates, and healthy fats to support energy and hormone production.',
          phase: 'follicular',
          priority: 'medium',
          citations: [
            {
              title: 'Nutrition and the menstrual cycle',
              authors: 'Gorczyca AM et al.',
              journal: 'Curr Nutr Rep',
              year: 2016,
              doi: '10.1007/s13668-016-0169-3',
            },
          ],
          disclaimer: 'Individual nutritional needs vary. Consult a registered dietitian for personalized nutrition advice.',
        });
        break;

      case 'ovulation':
        recommendations.push({
          id: 'nutrition-ovulation-1',
          category: 'nutrition',
          title: 'Antioxidant-Rich Foods',
          description: 'During ovulation, support your body with antioxidant-rich foods like berries, leafy greens, and nuts to help manage oxidative stress.',
          phase: 'ovulation',
          priority: 'low',
          citations: [
            {
              title: 'Antioxidants and female fertility',
              authors: 'Ruder EH et al.',
              journal: 'Obstet Gynecol Clin North Am',
              year: 2010,
              doi: '10.1016/j.ogc.2010.02.002',
            },
          ],
          disclaimer: 'Consult your doctor or dietitian for personalized nutrition recommendations.',
        });
        break;

      case 'luteal':
        recommendations.push(
          {
            id: 'nutrition-luteal-1',
            category: 'nutrition',
            title: 'Complex Carbohydrates & B Vitamins',
            description: 'During the luteal phase, complex carbohydrates can help stabilize mood and energy. Include whole grains, legumes, and B-vitamin rich foods.',
            phase: 'luteal',
            priority: 'high',
            citations: [
              {
                title: 'Carbohydrate intake and premenstrual syndrome',
                authors: 'Bertone-Johnson ER et al.',
                journal: 'Am J Clin Nutr',
                year: 2010,
                doi: '10.3945/ajcn.2009.29031',
              },
            ],
            disclaimer: 'Individual responses to dietary changes vary. Consult your doctor or dietitian for personalized advice.',
          },
          {
            id: 'nutrition-luteal-2',
            category: 'nutrition',
            title: 'Calcium & Vitamin D',
            description: 'Adequate calcium and vitamin D intake may help reduce PMS symptoms. Include dairy products, fortified foods, and consider sunlight exposure for vitamin D.',
            phase: 'luteal',
            priority: 'medium',
            citations: [
              {
                title: 'Calcium and vitamin D intake and risk of incident premenstrual syndrome',
                authors: 'Bertone-Johnson ER et al.',
                journal: 'Arch Intern Med',
                year: 2005,
                doi: '10.1001/archinte.165.11.1246',
              },
            ],
            disclaimer: 'Consult your doctor before taking calcium or vitamin D supplements, especially if you have kidney stones or hypercalcemia.',
          }
        );
        break;
    }

    return recommendations;
  }

  /**
   * Get stress management recommendations by phase
   */
  static getStressRecommendations(phase: CyclePhase): Recommendation[] {
    const recommendations: Recommendation[] = [];

    switch (phase) {
      case 'menstrual':
        recommendations.push({
          id: 'stress-menstrual-1',
          category: 'stress',
          title: 'Gentle Stress Reduction',
          description: 'During menstruation, prioritize rest and gentle stress-reduction techniques like meditation, deep breathing, or warm baths.',
          phase: 'menstrual',
          priority: 'high',
          citations: [
            {
              title: 'Mindfulness-based stress reduction for women',
              authors: 'Sood A et al.',
              journal: 'J Womens Health',
              year: 2014,
              doi: '10.1089/jwh.2013.4471',
            },
          ],
          disclaimer: 'If stress or mood symptoms are severe, consult your healthcare provider or mental health professional.',
        });
        break;

      case 'luteal':
        recommendations.push({
          id: 'stress-luteal-1',
          category: 'stress',
          title: 'Enhanced Stress Management',
          description: 'The luteal phase may be associated with increased stress sensitivity. Practice regular stress management techniques like yoga, meditation, or progressive muscle relaxation.',
          phase: 'luteal',
          priority: 'high',
          citations: [
            {
              title: 'Stress and the menstrual cycle',
              authors: 'Harlow SD et al.',
              journal: 'Am J Epidemiol',
              year: 1995,
              doi: '10.1093/oxfordjournals.aje.a117593',
            },
          ],
          disclaimer: 'If you experience severe stress, anxiety, or mood changes, consult your healthcare provider or mental health professional.',
        });
        break;

      default:
        recommendations.push({
          id: 'stress-general-1',
          category: 'stress',
          title: 'Regular Stress Management',
          description: 'Maintain regular stress management practices throughout your cycle to support overall well-being.',
          phase,
          priority: 'medium',
          citations: [
            {
              title: 'Stress management and women\'s health',
              authors: 'Nelson DB et al.',
              journal: 'J Womens Health',
              year: 2002,
              doi: '10.1089/154099902760193887',
            },
          ],
          disclaimer: 'If stress becomes overwhelming, consult your healthcare provider or mental health professional.',
        });
        break;
    }

    return recommendations;
  }

  /**
   * Get sleep optimization recommendations by phase
   */
  static getSleepRecommendations(phase: CyclePhase): Recommendation[] {
    const recommendations: Recommendation[] = [];

    switch (phase) {
      case 'luteal':
        recommendations.push({
          id: 'sleep-luteal-1',
          category: 'sleep',
          title: 'Sleep Quality Optimization',
          description: 'During the luteal phase, core body temperature is elevated and sleep quality may be affected. Maintain a cool sleep environment, consistent sleep schedule, and avoid screens before bed.',
          phase: 'luteal',
          priority: 'high',
          citations: [
            {
              title: 'Sleep and the menstrual cycle',
              authors: 'Baker FC, Driver HS',
              journal: 'Sleep Med Rev',
              year: 2007,
              doi: '10.1016/j.smrv.2006.09.001',
            },
          ],
          disclaimer: 'If you experience persistent sleep problems, consult your doctor or a sleep specialist.',
        });
        break;

      default:
        recommendations.push({
          id: 'sleep-general-1',
          category: 'sleep',
          title: 'Consistent Sleep Hygiene',
          description: 'Maintain consistent sleep hygiene practices: regular sleep schedule, dark and cool bedroom, and avoiding screens 1 hour before bed.',
          phase,
          priority: 'medium',
          citations: [
            {
              title: 'Sleep hygiene practices',
              authors: 'Irish LA et al.',
              journal: 'Sleep Med Rev',
              year: 2015,
              doi: '10.1016/j.smrv.2014.10.001',
            },
          ],
          disclaimer: 'If you experience persistent sleep problems, consult your doctor or a sleep specialist.',
        });
        break;
    }

    return recommendations;
  }

  /**
   * Get all recommendations for a phase
   */
  static getAllRecommendations(phase: CyclePhase): Recommendation[] {
    return [
      ...this.getWorkoutRecommendations(phase),
      ...this.getNutritionRecommendations(phase),
      ...this.getStressRecommendations(phase),
      ...this.getSleepRecommendations(phase),
    ];
  }
}
