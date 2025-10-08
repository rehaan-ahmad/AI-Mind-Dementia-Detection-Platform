'use server';
/**
 * @fileOverview A Genkit flow to analyze speech patterns for dementia indicators from audio data.
 *
 * - analyzeSpeechForDementiaIndicators - A function that analyzes audio data for dementia indicators.
 * - AnalyzeSpeechForDementiaIndicatorsInput - The input type for the analyzeSpeechForDementiaIndicators function.
 * - AnalyzeSpeechForDementiaIndicatorsOutput - The return type for the analyzeSpeechForDementiaIndicators function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const AnalyzeSpeechForDementiaIndicatorsInputSchema = z.object({
  audioDataUri: z
    .string()
    .describe(
      "A recording of the patient's speech, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  transcript: z.string().optional().describe('An optional pre-existing transcript of the audio.'),
});
export type AnalyzeSpeechForDementiaIndicatorsInput = z.infer<typeof AnalyzeSpeechForDementiaIndicatorsInputSchema>;

export const AnalyzeSpeechForDementiaIndicatorsOutputSchema = z.object({
  linguistic_features: z.object({
    wordFindingDifficulty: z.boolean().describe('Whether the patient struggles to find the right words.'),
    sentenceFragmentation: z.boolean().describe('Whether the patient speaks in incomplete sentences.'),
    repetition: z.boolean().describe('Whether the patient repeats words or phrases.'),
    lossOfCoherence: z.boolean().describe('Whether the patient\'s speech is illogical or hard to follow.'),
  }).describe('Analysis of the linguistic content of the speech.'),
  acoustic_features: z.object({
    speechRate: z.number().describe('The rate of speech in words per minute.'),
    pitchVariability: z.enum(['Low', 'Normal', 'High']).describe('The variability in vocal pitch.'),
    hesitationRatio: z.number().describe('The ratio of pause time to speaking time.'),
  }).describe('Analysis of the acoustic properties of the audio.'),
  risk_probability: z.number().min(0).max(1).describe('The probability (0 to 1) that dementia indicators are present in the speech.'),
  confidence: z.number().min(0).max(1).describe('The model\'s confidence in its analysis (0 to 1).'),
  key_indicators: z.array(z.string()).describe('A list of the most prominent indicators observed in the speech.'),
});
export type AnalyzeSpeechForDementiaIndicatorsOutput = z.infer<typeof AnalyzeSpeechForDementiaIndicatorsOutputSchema>;

export async function analyzeSpeechForDementiaIndicators(input: AnalyzeSpeechForDementiaIndicatorsInput): Promise<AnalyzeSpeechForDementiaIndicatorsOutput> {
  return analyzeSpeechForDementiaIndicatorsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeSpeechForDementiaIndicatorsPrompt',
  input: {schema: AnalyzeSpeechForDementiaIndicatorsInputSchema},
  output: {schema: AnalyzeSpeechForDementiaIndicatorsOutputSchema},
  prompt: `You are an AI expert in analyzing speech for early signs of cognitive decline and dementia. You will be given an audio file and an optional transcript. Your task is to perform a detailed analysis of both the linguistic and acoustic properties of the speech to identify potential indicators.

Analyze the provided audio: {{media url=audioDataUri}}

{{#if transcript}}
Also consider the provided transcript: {{{transcript}}}
{{/if}}

Based on the audio, provide a detailed analysis covering the following areas:

1.  **Linguistic Features**: Analyze the content of the speech. Note any difficulties in finding words, fragmented sentences, repetition of ideas or phrases, and any loss of coherence in the narrative.
2.  **Acoustic Features**: Analyze the sound of the speech. Estimate the speech rate, the variability in pitch (is it monotone or expressive?), and the hesitation ratio (pauses vs. speaking).
3.  **Risk Probability**: Based on all available data, estimate the probability that the speech contains indicators associated with dementia. This should be a numerical value between 0.0 and 1.0.
4.  **Confidence**: Provide your confidence in this assessment, also as a value between 0.0 and 1.0.
5.  **Key Indicators**: List the top 2-3 most significant indicators you observed that contributed to your analysis (e.g., "Frequent word-finding difficulty," "Slow speech rate," "Low pitch variability").

Return your analysis in a structured JSON format.`,
});

const analyzeSpeechForDementiaIndicatorsFlow = ai.defineFlow(
  {
    name: 'analyzeSpeechForDementiaIndicatorsFlow',
    inputSchema: AnalyzeSpeechForDementiaIndicatorsInputSchema,
    outputSchema: AnalyzeSpeechForDementiaIndicatorsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
