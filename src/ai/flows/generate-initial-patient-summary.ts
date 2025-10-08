// src/ai/flows/generate-initial-patient-summary.ts
'use server';
/**
 * @fileOverview Generates an initial patient summary using GenAI.
 *
 * - generateInitialPatientSummary - A function that generates the patient summary.
 * - GenerateInitialPatientSummaryInput - The input type for the generateInitialPatientSummary function.
 * - GenerateInitialPatientSummaryOutput - The return type for the generateInitialPatientSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateInitialPatientSummaryInputSchema = z.object({
  mriScanSummary: z.string().describe('Summary of MRI scan results.'),
  cognitiveTestResults: z.string().describe('Results from cognitive tests.'),
  patientHistory: z.string().describe('The patient medical history.'),
});
export type GenerateInitialPatientSummaryInput = z.infer<typeof GenerateInitialPatientSummaryInputSchema>;

const GenerateInitialPatientSummaryOutputSchema = z.object({
  summary: z.string().describe('A summary of the patient medical history and available data.'),
});
export type GenerateInitialPatientSummaryOutput = z.infer<typeof GenerateInitialPatientSummaryOutputSchema>;

export async function generateInitialPatientSummary(
  input: GenerateInitialPatientSummaryInput
): Promise<GenerateInitialPatientSummaryOutput> {
  return generateInitialPatientSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateInitialPatientSummaryPrompt',
  input: {schema: GenerateInitialPatientSummaryInputSchema},
  output: {schema: GenerateInitialPatientSummaryOutputSchema},
  prompt: `You are an AI assistant that summarizes patient medical history and data for doctors.

  Summarize the following information into a concise overview:

  MRI Scan Summary: {{{mriScanSummary}}}
  Cognitive Test Results: {{{cognitiveTestResults}}}
  Patient History: {{{patientHistory}}}
  `,
});

const generateInitialPatientSummaryFlow = ai.defineFlow(
  {
    name: 'generateInitialPatientSummaryFlow',
    inputSchema: GenerateInitialPatientSummaryInputSchema,
    outputSchema: GenerateInitialPatientSummaryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
