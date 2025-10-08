import { config } from 'dotenv';
config();

import '@/ai/flows/explain-risk-assessment-rationale.ts';
import '@/ai/flows/generate-initial-patient-summary.ts';
import '@/ai/flows/improve-data-entry-using-suggestions.ts';
import '@/ai/flows/analyze-speech-for-dementia-indicators.ts';
import '@/ai/flows/analyze-gait-for-dementia-indicators.ts';
