import type { Patient } from './types';

export const patients: Patient[] = [
  {
    id: 'pat_1',
    name: 'Johnathan "John" Doe',
    age: 72,
    gender: 'Male',
    avatarId: 'avatar1',
    mriScanId: 'mri-scan-1',
    mriScanSummary:
      'Mild cortical atrophy, consistent with age. No signs of acute infarction or hemorrhage. Minor white matter hyperintensities observed.',
    cognitiveTestResults:
      'MMSE score of 24/30. Difficulties with delayed recall and complex attention tasks noted. Verbal fluency is within normal limits.',
    patientHistory:
      'Long-standing history of hypertension and hyperlipidemia, both managed with medication. Reports increasing memory lapses and word-finding difficulties over the past 12-18 months. Family has noticed personality changes, including increased irritability.',
    riskAssessment: {
      level: 'Medium',
      score: 68,
    },
  },
  {
    id: 'pat_2',
    name: 'Eleanor Vance',
    age: 68,
    gender: 'Female',
    avatarId: 'avatar2',
    mriScanId: 'mri-scan-2',
    mriScanSummary:
      'Age-appropriate brain volume. No significant atrophy or vascular pathology noted. Hippocampal volume appears normal for age.',
    cognitiveTestResults:
      'MMSE score of 28/30. Scored slightly below average on one measure of executive function, but performance was otherwise robust. No significant cognitive decline reported.',
    patientHistory:
      'Active individual with no significant medical history. Came in for a baseline cognitive assessment due to family history of Alzheimer\'s disease. Reports no subjective memory complaints.',
    riskAssessment: {
      level: 'Low',
      score: 22,
    },
  },
  {
    id: 'pat_3',
    name: 'Samuel "Sam" Jones',
    age: 81,
    gender: 'Male',
    avatarId: 'avatar3',
    mriScanId: 'mri-scan-3',
    mriScanSummary:
      'Significant generalized cerebral atrophy, more pronounced in the medial temporal lobes. Moderate to severe white matter disease. Evidence of prior lacunar infarcts.',
    cognitiveTestResults:
      'MMSE score of 19/30. Shows significant impairment across multiple cognitive domains, including memory, language, and visuospatial function. Unable to complete clock-drawing test accurately.',
    patientHistory:
      'Patient has a history of type 2 diabetes and a previous minor stroke 5 years ago. Brought in by his daughter who reports a rapid decline in his memory and ability to perform daily activities over the last 2 years. Patient is often disoriented to time and place.',
    riskAssessment: {
      level: 'High',
      score: 91,
    },
  },
];
