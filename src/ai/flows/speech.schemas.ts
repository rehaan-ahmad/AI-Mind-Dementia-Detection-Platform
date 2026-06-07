
/**
 * @fileOverview Standardized schemas for the speech analysis flow.
 */

import { z } from 'genkit';

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
