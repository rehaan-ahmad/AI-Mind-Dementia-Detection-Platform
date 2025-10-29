'use server';
/**
 * @fileOverview Generates clinical recommendations based on patient data.
 *
 * - generateRecommendations - A function that generates recommendations.
 */

import {
  generateRecommendationsFlow,
  type GenerateRecommendationsInput,
  type GenerateRecommendationsOutput
} from './recommendations.schemas';

export async function generateRecommendations(input: GenerateRecommendationsInput): Promise<GenerateRecommendationsOutput> {
  // return generateRecommendationsFlow(input);
  console.log("Mocking AI call for generateRecommendations");
  await new Promise(resolve => setTimeout(resolve, 800));
  return {
    recommendations: [
      {
        area: "Cognitive Function",
        recommendation: "Consider a more detailed neuropsychological evaluation to better characterize the deficits in delayed recall and executive function.",
        priority: "High"
      },
      {
        area: "Imaging",
        recommendation: "A follow-up MRI in 12-18 months could be useful to track the rate of cortical atrophy.",
        priority: "Medium"
      },
      {
        area: "Physical Health",
        recommendation: "Continue aggressive management of hypertension and hyperlipidemia to mitigate vascular risk factors.",
        priority: "High"
      },
      {
        area: "Functional Assessment",
        recommendation: "Engage with a social worker or occupational therapist to assess the impact of financial management difficulties on the patient's independence and safety.",
        priority: "Medium"
      }
    ]
  };
}
