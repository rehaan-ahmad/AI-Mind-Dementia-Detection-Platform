'use server';

import { z } from 'zod';

// This schema would be used to validate the form data on the server.
const patientFormSchema = z.object({
    name: z.string().min(2),
    age: z.coerce.number().min(0).max(120),
    gender: z.enum(['Male', 'Female', 'Other']),
    educationLevel: z.string().min(1),
    familyHistory: z.string().optional(),
    medications: z.string().optional(),
    patientHistory: z.string().min(10),
    activitiesOfDailyLiving: z.string().min(10),
    physicalExamNotes: z.string().min(10),
    cognitiveTestResults: z.string().min(10),
    mriScanSummary: z.string().min(10),
});

export async function createPatient(data: z.infer<typeof patientFormSchema>) {
  // 1. Validate the data on the server
  const validatedData = patientFormSchema.safeParse(data);

  if (!validatedData.success) {
    // For debugging purposes, log the validation errors
    console.error('Validation failed:', validatedData.error.flatten());
    throw new Error('Invalid patient data provided.');
  }

  // 2. Simulate saving the data to a database
  console.log('Creating new patient with data:', validatedData.data);
  
  // Simulate network latency
  await new Promise(res => setTimeout(res, 1500));
  
  // In a real application, you would add the data to Firestore here
  // and then revalidate the path to update the cache.
  // e.g., revalidatePath('/');

  console.log('Patient created successfully (mock).');

  return { message: 'Patient created successfully' };
}
