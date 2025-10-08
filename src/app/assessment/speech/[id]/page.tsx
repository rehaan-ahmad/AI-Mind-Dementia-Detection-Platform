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

  const handleRecordingComplete = (audioBlob: Blob, duration: number) => {
    console.log('Recording complete!');
    console.log('Blob size:', audioBlob.size);
    console.log('Blob type:', audioBlob.type);
    console.log('Duration:', duration, 'seconds');
    // In a real app, you would upload the blob to a server here.
    // e.g., uploadAudio(audioBlob);
  };

  const handleError = (error: string) => {
    console.error("Recorder Error:", error);
    // You could show a more prominent error message to the user here.
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
            Ask the patient to describe a recent memory or a picture. The system will record their response for analysis.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AudioRecorder 
            onRecordingComplete={handleRecordingComplete}
            onError={handleError}
            maxDuration={120} // 2 minutes
            instructions="Please press 'Start Recording' and ask the patient to speak clearly. The recording will stop automatically after 2 minutes."
          />
        </CardContent>
      </Card>
    </div>
  );
}
