'use server';
/**
 * @fileOverview An AI agent that provides suggestions during patient data entry to improve accuracy and completeness.
 *
 * - improveDataEntryUsingSuggestions - A function that handles the process of providing data entry suggestions.
 * - ImproveDataEntryInput - The input type for the improveDataEntryUsingSuggestions function.
 * - ImproveDataEntryOutput - The return type for the improveDataEntryUsingSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ImproveDataEntryInputSchema = z.object({
  currentData: z
    .string()
    .describe('The current patient data that has been entered.'),
  dataType: z
    .string()
    .describe(
      'The type of data being entered (e.g., cognitive test results, patient history).' //  Clarified the description
    ),
  fieldDescription: z
    .string()
    .describe(
      'A description of the specific field for which suggestions are needed.'
    ),
});
export type ImproveDataEntryInput = z.infer<typeof ImproveDataEntryInputSchema>;

const ImproveDataEntryOutputSchema = z.object({
  suggestions: z
    .array(z.string())
    .describe('AI-powered suggestions to improve the accuracy and completeness of the data entry.'),
  confidenceScores: z
    .array(z.number())
    .describe('Confidence scores for each suggestion, indicating the AI confidence in its relevance.'),
});
export type ImproveDataEntryOutput = z.infer<typeof ImproveDataEntryOutputSchema>;

export async function improveDataEntryUsingSuggestions(
  input: ImproveDataEntryInput
): Promise<ImproveDataEntryOutput> {
  return improveDataEntryUsingSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'improveDataEntryUsingSuggestionsPrompt',
  input: {schema: ImproveDataEntryInputSchema},
  output: {schema: ImproveDataEntryOutputSchema},
  prompt: `You are an AI assistant designed to help doctors improve the accuracy and completeness of patient data entry.

You will receive the current patient data, the type of data being entered, and a description of the specific field for which suggestions are needed.

Based on this information, provide AI-powered suggestions to improve the data entry, along with confidence scores for each suggestion.

Current Data: {{{currentData}}}
Data Type: {{{dataType}}}
Field Description: {{{fieldDescription}}}

Suggestions (array of strings): Provide suggestions to improve the accuracy and completeness of the data entry.
Confidence Scores (array of numbers): Provide confidence scores (0-1) for each suggestion, indicating the AI confidence in its relevance.

Ensure that the output matches the output schema definition using descriptions. Do not include any introductory or concluding remarks, just the JSON.
`,
});

const improveDataEntryUsingSuggestionsFlow = ai.defineFlow(
  {
    name: 'improveDataEntryUsingSuggestionsFlow',
    inputSchema: ImproveDataEntryInputSchema,
    outputSchema: ImproveDataEntryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
