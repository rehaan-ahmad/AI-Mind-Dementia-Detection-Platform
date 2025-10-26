
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { createPatient as mockCreatePatient } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Loader2, ArrowLeft, ArrowRight } from 'lucide-react';
import * as React from 'react';
import { ProgressStepper } from './ui/progress-stepper';
import { useAuth } from '@/app/auth/auth-provider';

const patientFormSchema = z.object({
  name: z.string().min(2, {
    message: 'Patient name must be at least 2 characters.',
  }),
  age: z.coerce.number().min(0).max(120),
  gender: z.enum(['Male', 'Female', 'Other']),
  educationLevel: z.string().min(1, { message: 'Education level is required.' }),
  familyHistory: z.string().optional(),
  medications: z.string().optional(),
  patientHistory: z.string().min(10, {
    message: 'Patient history must be at least 10 characters.',
  }),
  activitiesOfDailyLiving: z.string().min(10, { message: 'ADL information is required.' }),
  physicalExamNotes: z.string().min(10, { message: 'Physical exam notes are required.' }),
  cognitiveTestResults: z.string().min(10, {
    message: 'Cognitive test results must be at least 10 characters.',
  }),
  mriScanSummary: z.string().min(10, {
    message: 'MRI scan summary must be at least 10 characters.',
  }),
});

type PatientFormValues = z.infer<typeof patientFormSchema>;

const steps = [
    { name: 'Demographics', fields: ['name', 'age', 'gender', 'educationLevel'] },
    { name: 'Clinical History', fields: ['patientHistory', 'familyHistory', 'medications'] },
    { name: 'Assessments', fields: ['activitiesOfDailyLiving', 'physicalExamNotes'] },
    { name: 'Diagnostics', fields: ['cognitiveTestResults', 'mriScanSummary'] },
];


export function PatientForm() {
  const router = useRouter();
  const { toast } = useToast();
  const { addPatient } = useAuth();
  const [currentStep, setCurrentStep] = React.useState(0);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  
  const form = useForm<PatientFormValues>({
    resolver: zodResolver(patientFormSchema),
    defaultValues: {
      name: '',
      age: 70,
      gender: 'Male',
      educationLevel: '',
      familyHistory: '',
      medications: '',
      patientHistory: '',
      activitiesOfDailyLiving: '',
      physicalExamNotes: '',
      cognitiveTestResults: '',
      mriScanSummary: '',
    },
  });

  const nextStep = async () => {
    const fields = steps[currentStep].fields;
    const output = await form.trigger(fields as any, { shouldFocus: true });

    if (!output) return;

    if (currentStep < steps.length - 1) {
        setCurrentStep(step => step + 1);
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
        setCurrentStep(step => step - 1);
    }
  }


  async function onSubmit(data: PatientFormValues) {
    setIsSubmitting(true);
    try {
      // We still call the mock server action to simulate a network request
      await mockCreatePatient(data);
      
      // But we update the client-side state using our context
      addPatient(data);

      toast({
        title: 'Patient Added',
        description: 'The new patient has been successfully saved.',
      });
      router.push('/dashboard');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Something went wrong while saving the patient.',
      });
    } finally {
        setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-8">
    <ProgressStepper steps={steps.map(s => s.name)} currentStep={currentStep} />
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        
        {currentStep === 0 && (
            <div className="space-y-4">
                <h3 className="text-lg font-medium">Demographics</h3>
                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                    <FormItem className="md:col-span-2">
                        <FormLabel>Patient Name</FormLabel>
                        <FormControl>
                        <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="age"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Age</FormLabel>
                        <FormControl>
                        <Input type="number" placeholder="75" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                </div>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                    <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Gender</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                            <SelectItem value="Male">Male</SelectItem>
                            <SelectItem value="Female">Female</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                        control={form.control}
                        name="educationLevel"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Education Level</FormLabel>
                            <FormControl>
                            <Input placeholder="e.g., 16 years, Bachelor's Degree" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                </div>
            </div>
        )}

        {currentStep === 1 && (
            <div className="space-y-4">
                <h3 className="text-lg font-medium">Clinical History</h3>
                <FormField
                    control={form.control}
                    name="patientHistory"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Chief Complaint & Patient History</FormLabel>
                        <FormControl>
                            <Textarea
                            placeholder="Describe the patient's primary complaint and relevant medical history..."
                            className="min-h-[120px]"
                            {...field}
                            />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                control={form.control}
                name="familyHistory"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Family History</FormLabel>
                    <FormControl>
                        <Textarea
                        placeholder="Note any family history of dementia or other neurological disorders..."
                        className="min-h-[100px]"
                        {...field}
                        />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="medications"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Current Medications</FormLabel>
                    <FormControl>
                        <Textarea
                        placeholder="List all current medications and dosages..."
                        className="min-h-[100px]"
                        {...field}
                        />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
        )}

        {currentStep === 2 && (
            <div className="space-y-4">
                <h3 className="text-lg font-medium">Functional & Physical Assessment</h3>
                <FormField
                control={form.control}
                name="activitiesOfDailyLiving"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Activities of Daily Living (ADLs)</FormLabel>
                    <FormControl>
                        <Textarea
                        placeholder="Describe the patient's ability to perform daily tasks (e.g., bathing, dressing, finances)..."
                        className="min-h-[120px]"
                        {...field}
                        />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="physicalExamNotes"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Physical Exam Notes</FormLabel>
                    <FormControl>
                        <Textarea
                        placeholder="Enter key findings from the physical and neurological exam..."
                        className="min-h-[120px]"
                        {...field}
                        />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
        )}

        {currentStep === 3 && (
            <div className="space-y-4">
                <h3 className="text-lg font-medium">Diagnostics</h3>
                <FormField
                    control={form.control}
                    name="cognitiveTestResults"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Cognitive Test Results</FormLabel>
                        <FormControl>
                            <Textarea
                            placeholder="Enter results from MMSE, MoCA, etc."
                            className="min-h-[120px]"
                            {...field}
                            />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="mriScanSummary"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>MRI Scan Summary</FormLabel>
                        <FormControl>
                            <Textarea
                            placeholder="Summarize key findings from the MRI report."
                            className="min-h-[120px]"
                            {...field}
                            />
                        </FormControl>
                        <FormDescription>
                            AI will use this summary to help form the risk assessment.
                        </FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
        )}
        
      </form>
    </Form>

    <div className="flex justify-between pt-4">
        {currentStep > 0 ? (
            <Button type="button" variant="outline" onClick={prevStep}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
            </Button>
        ) : <div />}

        {currentStep < steps.length - 1 ? (
             <Button type="button" onClick={nextStep}>
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
        ) : (
            <Button type="submit" disabled={isSubmitting} onClick={form.handleSubmit(onSubmit)}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Patient
            </Button>
        )}
    </div>
    </div>
  );
}
