export type Patient = {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  avatarId: string;
  mriScanId: string;
  mriScanSummary: string;
  cognitiveTestResults: string;
  patientHistory: string;
  riskAssessment: {
    level: 'Low' | 'Medium' | 'High';
    score: number;
  };
};
