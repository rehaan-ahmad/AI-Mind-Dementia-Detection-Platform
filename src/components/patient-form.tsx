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
import { createPatient } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import * as React from 'react';

const patientFormSchema = z.object({
  name: z.string().min(2, {
    message: 'Patient name must be at least 2 characters.',
  }),
  age: z.coerce.number().min(0).max(120),
  gender: z.enum(['Male', 'Female', 'Other']),
  patientHistory: z.string().min(10, {
    message: 'Patient history must be at least 10 characters.',
  }),
  cognitiveTestResults: z.string().min(10, {
    message: 'Cognitive test results must be at least 10 characters.',
  }),
  mriScanSummary: z.string().min(10, {
    message: 'MRI scan summary must be at least 10 characters.',
  }),
});

type PatientFormValues = z.infer<typeof patientFormSchema>;

export function PatientForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  
  const form = useForm<PatientFormValues>({
    resolver: zodResolver(patientFormSchema),
    defaultValues: {
      name: '',
      age: 70,
      gender: 'Male',
      patientHistory: '',
      cognitiveTestResults: '',
      mriScanSummary: '',
    },
  });

  async function onSubmit(data: PatientFormValues) {
    setIsSubmitting(true);
    try {
      await createPatient(data);
      toast({
        title: 'Patient Added',
        description: 'The new patient has been successfully saved (mock).',
      });
      router.push('/');
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
          name="patientHistory"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Patient History</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe the patient's relevant medical history..."
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
          name="cognitiveTestResults"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cognitive Test Results</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter results from MMSE, MoCA, etc."
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
          name="mriScanSummary"
          render={({ field }) => (
            <FormItem>
              <FormLabel>MRI Scan Summary</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Summarize key findings from the MRI report."
                  className="min-h-[100px]"
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

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Patient
          </Button>
        </div>
      </form>
    </Form>
  );
}
