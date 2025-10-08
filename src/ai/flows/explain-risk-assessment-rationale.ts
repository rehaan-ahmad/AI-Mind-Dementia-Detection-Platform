'use server';
/**
 * @fileOverview Explains the rationale behind a dementia risk assessment.
 *
 * - explainRiskAssessmentRationale - A function that explains the rationale behind a dementia risk assessment.
 * - ExplainRiskAssessmentRationaleInput - The input type for the explainRiskAssessmentRationale function.
 * - ExplainRiskAssessmentRationaleOutput - The return type for the explainRiskAssessmentRationale function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainRiskAssessmentRationaleInputSchema = z.object({
  patientData: z.string().describe('The patient data, including MRI scans, cognitive test results, and patient history.'),
  riskAssessment: z.string().describe('The dementia risk assessment provided by the AI.'),
});
export type ExplainRiskAssessmentRationaleInput = z.infer<typeof ExplainRiskAssessmentRationaleInputSchema>;

const ExplainRiskAssessmentRationaleOutputSchema = z.object({
  explanation: z.string().describe('A clear, concise explanation of why the risk assessment was given, highlighting the key factors and data points that influenced the AI\'s decision.'),
});
export type ExplainRiskAssessmentRationaleOutput = z.infer<typeof ExplainRiskAssessmentRationaleOutputSchema>;

export async function explainRiskAssessmentRationale(input: ExplainRiskAssessmentRationaleInput): Promise<ExplainRiskAssessmentRationaleOutput> {
  // return explainRiskAssessmentRationaleFlow(input);
  console.log("Mocking AI call for explainRiskAssessmentRationale");
  await new Promise(resolve => setTimeout(resolve, 500));
  return {
    explanation: "The patient's risk assessment is primarily driven by significant cerebral atrophy observed in the medial temporal lobes on the MRI scan, which is a key indicator for neurodegeneration. This is compounded by a notable decline in cognitive test scores, particularly in memory recall and executive function. The patient's history of type 2 diabetes and a prior lacunar infarct also contribute as vascular risk factors. While family history is not present, the combination of imaging, cognitive decline, and vascular history points towards a high-risk profile."
  };
}
/*
const prompt = ai.definePrompt({
  name: 'explainRiskAssessmentRationalePrompt',
  input: {schema: ExplainRiskAssessmentRationaleInputSchema},
  output: {schema: ExplainRiskAssessmentRationaleOutputSchema},
  prompt: `You are an AI expert specializing in explaining dementia risk assessments.

You will receive patient data and a risk assessment. Your goal is to provide a clear and concise explanation of why the risk assessment was given, highlighting the key factors and data points that influenced the AI\'s decision.

Patient Data: {{{patientData}}}
Risk Assessment: {{{riskAssessment}}}

Explanation:`,
});

const explainRiskAssessmentRationaleFlow = ai.defineFlow(
  {
    name: 'explainRiskAssessmentRationaleFlow',
    inputSchema: ExplainRiskAssessmentRationaleInputSchema,
    outputSchema: ExplainRiskAssessmentRationaleOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
*/
