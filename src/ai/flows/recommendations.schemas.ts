/**
 * @fileOverview Schemas for the recommendations flow.
 *
 * - GenerateRecommendationsInput - The input type for the generateRecommendations function.
 * - GenerateRecommendationsOutput - The return type for the generateRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecommendationSchema = z.object({
  area: z.string().describe('The clinical area of the recommendation (e.g., "Cognitive Function", "Physical Health").'),
  recommendation: z.string().describe('The specific, actionable recommendation for the healthcare provider.'),
  priority: z.enum(['High', 'Medium', 'Low']).describe('The priority level of the recommendation.'),
});

export const GenerateRecommendationsInputSchema = z.object({
  patientData: z.string().describe('A JSON string of all available patient data, including demographics, history, test results, and risk assessment.'),
});
export type GenerateRecommendationsInput = z.infer<typeof GenerateRecommendationsInputSchema>;

export const GenerateRecommendationsOutputSchema = z.object({
  recommendations: z.array(RecommendationSchema).describe('A list of clinical recommendations.'),
});
export type GenerateRecommendationsOutput = z.infer<typeof GenerateRecommendationsOutputSchema>;

const prompt = ai.definePrompt({
  name: 'generateRecommendationsPrompt',
  input: {schema: GenerateRecommendationsInputSchema},
  output: {schema: GenerateRecommendationsOutputSchema},
  prompt: `You are an expert medical AI assistant. Your task is to provide clinical recommendations for a patient based on their comprehensive data profile.

Analyze the following patient data:
{{{patientData}}}

Based on the data, generate a list of 3-5 actionable recommendations for the healthcare provider. For each recommendation, specify the clinical area, the recommendation itself, and a priority level (High, Medium, or Low). Focus on the most critical next steps for diagnosis, monitoring, or treatment.

Return the recommendations in the specified JSON format.`,
});

export const generateRecommendationsFlow = ai.defineFlow(
  {
    name: 'generateRecommendationsFlow',
    inputSchema: GenerateRecommendationsInputSchema,
    outputSchema: GenerateRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
