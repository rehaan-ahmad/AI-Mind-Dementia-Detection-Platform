
'use server';
/**
 * @fileOverview A Genkit flow to analyze gait patterns for dementia indicators from sensor data.
 *
 * - analyzeGaitForDementiaIndicators - A function that analyzes sensor data for dementia indicators.
 * - AnalyzeGaitForDementiaIndicatorsInput - The input type for the analyzeGaitForDementiaIndicators function.
 * - AnalyzeGaitForDementiaIndicatorsOutput - The return type for the analyzeGaitForDementiaIndicators function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

export const AnalyzeGaitForDementiaIndicatorsInputSchema = z.object({
  videoDataUri: z
    .string()
    .describe(
      "A video of the patient's gait, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AnalyzeGaitForDementiaIndicatorsInput = z.infer<typeof AnalyzeGaitForDementiaIndicatorsInputSchema>;

export const AnalyzeGaitForDementiaIndicatorsOutputSchema = z.object({
    gait_speed: z.number().describe('The average speed of walking in meters per second.'),
    stride_length: z.number().describe('The average length of a single stride in meters.'),
    cadence: z.number().describe('The number of steps taken per minute.'),
    gait_variability: z.number().describe('The measure of stride-to-stride fluctuations.'),
    risk_probability: z.number().min(0).max(1).describe('The probability (0 to 1) that gait indicators for dementia are present.'),
    confidence: z.number().min(0).max(1).describe('The model\'s confidence in its analysis (0 to 1).'),
});
export type AnalyzeGaitForDementiaIndicatorsOutput = z.infer<typeof AnalyzeGaitForDementiaIndicatorsOutputSchema>;

export async function analyzeGaitForDementiaIndicators(input: AnalyzeGaitForDementiaIndicatorsInput): Promise<AnalyzeGaitForDementiaIndicatorsOutput> {
  return analyzeGaitForDementiaIndicatorsFlow(input);
}


const prompt = ai.definePrompt({
    name: 'analyzeGaitForDementiaIndicatorsPrompt',
    input: { schema: AnalyzeGaitForDementiaIndicatorsInputSchema },
    output: { schema: AnalyzeGaitForDementiaIndicatorsOutputSchema },
    prompt: `You are an AI expert in biomechanics and neurology, specializing in analyzing gait for early signs of cognitive decline and dementia. You will be given a video of a person walking.

Analyze the provided video: {{media url=videoDataUri}}

Your task is to perform a detailed analysis of the patient's gait and provide the following metrics:
1.  **Gait Speed**: Estimate the average walking speed in meters per second.
2.  **Stride Length**: Estimate the average length of a single stride (heel of one foot to heel of the same foot) in meters.
3.  **Cadence**: Estimate the number of steps taken per minute.
4.  **Gait Variability**: Provide a normalized score (0 to 1) representing stride-to-stride fluctuations in timing and length. Higher values indicate more variability.
5.  **Risk Probability**: Based on all observations, estimate the probability (0.0 to 1.0) that the gait displays indicators associated with dementia.
6.  **Confidence**: Provide your confidence in this assessment (0.0 to 1.0).

Return your analysis in a structured JSON format.`,
});


const analyzeGaitForDementiaIndicatorsFlow = ai.defineFlow(
  {
    name: 'analyzeGaitForDementiaIndicatorsFlow',
    inputSchema: AnalyzeGaitForDementiaIndicatorsInputSchema,
    outputSchema: AnalyzeGaitForDementiaIndicatorsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

