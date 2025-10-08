'use client';

import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { patients } from '@/lib/data';
import { ArrowLeft } from 'lucide-react';
import { AudioRecorder } from '@/components/audio-recorder';


export default function SpeechAssessmentPage({ params }: { params: { id: string } }) {
  const patient = patients.find((p) => p.id === params.id);

  if (!patient) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href={`/patients/${patient.id}`}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to Patient Details</span>
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Speech Assessment</h1>
          <p className="text-muted-foreground">
            For patient: {patient.name}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Record Patient's Speech</CardTitle>
          <CardDescription>
            Ask the patient to describe a memory or a picture. The system will record and transcribe their response.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AudioRecorder />
        </CardContent>
      </Card>
    </div>
  );
}
