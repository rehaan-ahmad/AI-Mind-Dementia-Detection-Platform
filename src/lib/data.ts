
import type { Patient } from './types';

export const patients: Patient[] = [
  {
    id: 'pat_1',
    name: 'Arjun Kumar',
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
    educationLevel: '16 years (Bachelor\'s Degree)',
    familyHistory: 'Mother diagnosed with Alzheimer\'s disease at age 80.',
    medications: 'Lisinopril, Atorvastatin',
    activitiesOfDailyLiving: 'Independent with all ADLs, but has difficulty managing finances.',
    physicalExamNotes: 'BP 135/85 mmHg, HR 70 bpm. Neurological exam unremarkable except for mild symmetric reflex diminution.',
    timeline: [
        { date: '2022-10-15', title: 'Initial Consultation', description: 'Patient and wife presented with concerns about memory decline. Reported word-finding issues and misplacing items.', icon: 'Stethoscope' },
        { date: '2022-11-01', title: 'Cognitive Testing (MMSE)', description: 'Scored 24/30. Showed deficits in delayed recall and attention.', icon: 'FileText' },
        { date: '2022-11-20', title: 'MRI of the Brain', description: 'Mild cortical atrophy noted, consistent with age. No acute findings.', icon: 'Scan' },
        { date: '2023-01-10', title: 'Medication Adjustment', description: 'Lisinopril dosage adjusted to better control blood pressure.', icon: 'Pill' },
        { date: '2023-05-22', title: 'Follow-up Visit', description: 'Family reports increased irritability and difficulty with financial management.', icon: 'Stethoscope'},
        { date: '2023-11-05', title: 'Risk Assessment Generated', description: 'AI-Mind platform calculated a 68% risk score, classified as Medium.', icon: 'AlertTriangle' }
    ]
  },
  {
    id: 'pat_2',
    name: 'Priya Sharma',
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
    educationLevel: '18 years (Master\'s Degree)',
    familyHistory: 'Father had late-onset Alzheimer\'s.',
    medications: 'None',
    activitiesOfDailyLiving: 'Fully independent in all ADLs and IADLs.',
    physicalExamNotes: 'BP 120/75 mmHg, HR 65 bpm. Normal neurological exam.',
    timeline: [
        { date: '2023-03-10', title: 'Baseline Wellness Visit', description: 'Patient requested a baseline cognitive and physical check-up due to family history.', icon: 'Stethoscope' },
        { date: '2023-03-25', title: 'Cognitive Testing (MMSE)', description: 'Scored 28/30. Excellent performance overall, minor dip in one executive function sub-task.', icon: 'FileText' },
        { date: '2023-04-12', title: 'MRI of the Brain', description: 'Scan showed normal, age-appropriate brain volume.', icon: 'Scan' },
        { date: '2023-04-20', title: 'Risk Assessment Generated', description: 'AI-Mind platform calculated a 22% risk score, classified as Low.', icon: 'AlertTriangle' }
    ]
  },
  {
    id: 'pat_3',
    name: 'Vikram Singh',
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
    educationLevel: '12 years (High School Diploma)',
    familyHistory: 'No known family history of dementia.',
    medications: 'Metformin, Insulin, Clopidogrel',
    activitiesOfDailyLiving: 'Requires assistance with bathing, dressing, and managing medications. Cannot handle finances.',
    physicalExamNotes: 'BP 140/90 mmHg. Right-sided pronator drift and subtle gait instability noted.',
    timeline: [
        { date: '2021-08-01', title: 'Post-Stroke Follow-up', description: 'Follow-up after minor stroke. Some residual right-sided weakness.', icon: 'Stethoscope' },
        { date: '2022-06-15', title: 'Family Concern', description: 'Daughter called to report increasing confusion and memory problems.', icon: 'Stethoscope' },
        { date: '2022-07-10', title: 'Cognitive Testing (MMSE)', description: 'Scored 22/30. Deficits noted in memory and orientation.', icon: 'FileText' },
        { date: '2023-02-20', title: 'Hospitalization for Fall', description: 'Patient had an unwitnessed fall at home, no major injuries.', icon: 'AlertTriangle' },
        { date: '2023-03-05', title: 'In-depth Assessment', description: 'Brought to clinic by daughter for full workup due to rapid functional decline.', icon: 'Stethoscope' },
        { date: '2023-03-15', title: 'MRI of the Brain', description: 'Significant atrophy and white matter disease observed.', icon: 'Scan' },
        { date: '2023-04-02', title: 'Cognitive Retest (MMSE)', description: 'Score dropped to 19/30. Worsening visuospatial function.', icon: 'FileText' },
        { date: '2023-04-10', title: 'Risk Assessment Generated', description: 'AI-Mind platform calculated a 91% risk score, classified as High.', icon: 'AlertTriangle' }
    ]
  },
];
