'use client';

import * as React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { patients } from '@/lib/data';
import { ArrowLeft, Mic, Square, Loader2, Info } from 'lucide-react';

export default function SpeechAssessmentPage({ params }: { params: { id: string } }) {
  const patient = patients.find((p) => p.id === params.id);
  const { toast } = useToast();

  const [hasCameraPermission, setHasCameraPermission] = React.useState(false);
  const [isRecording, setIsRecording] = React.useState(false);
  const [transcript, setTranscript] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  
  const videoRef = React.useRef<HTMLVideoElement>(null);

  React.useEffect(() => {
    const getCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setHasCameraPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera & Microphone Access Denied',
          description: 'Please enable camera and microphone permissions in your browser settings.',
        });
      }
    };

    getCameraPermission();
  }, [toast]);


  const handleToggleRecording = () => {
    if (isRecording) {
      // Logic to stop recording would go here
      setIsRecording(false);
      // For demonstration, we'll just populate the transcript
      setTranscript('The patient described their childhood home, recalling the "big oak tree in the front yard" and the "smell of freshly baked bread on Sundays." Speech was clear but somewhat slow. Some word-finding difficulty was noted when trying to recall the name of their elementary school.');
    } else {
      // Logic to start recording would go here
      setIsRecording(true);
      setTranscript('');
    }
  };
  
  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(res => setTimeout(res, 1500));
    toast({
        title: 'Assessment Submitted',
        description: 'The speech assessment has been saved.',
    });
    setIsSubmitting(false);
  }

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
            Ask the patient to describe a memory or a picture. Record their response below.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!hasCameraPermission && (
            <Alert variant="destructive">
                <Info className="h-4 w-4" />
              <AlertTitle>Camera and Microphone Access Required</AlertTitle>
              <AlertDescription>
                Please allow access to your camera and microphone to proceed with the assessment.
              </AlertDescription>
            </Alert>
          )}
          
          <div className="bg-muted rounded-lg p-4 flex flex-col items-center justify-center space-y-4 min-h-[300px]">
            <video ref={videoRef} className="w-full aspect-video rounded-md bg-background" autoPlay muted playsInline />
            <Button
              onClick={handleToggleRecording}
              disabled={!hasCameraPermission}
              size="lg"
              variant={isRecording ? 'destructive' : 'default'}
            >
              {isRecording ? (
                <>
                  <Square className="mr-2 h-5 w-5" />
                  Stop Recording
                </>
              ) : (
                <>
                  <Mic className="mr-2 h-5 w-5" />
                  Start Recording
                </>
              )}
            </Button>
          </div>

          <div>
            <label htmlFor="transcript" className="block text-sm font-medium text-foreground mb-2">
              Live Transcript
            </label>
            <Textarea
              id="transcript"
              placeholder="The live transcript of the patient's speech will appear here..."
              value={transcript}
              readOnly={isRecording}
              onChange={(e) => setTranscript(e.target.value)}
              className="min-h-[150px] bg-background"
            />
             <p className="text-sm text-muted-foreground mt-2">
                You can manually edit the transcript after recording is complete.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button onClick={handleSubmit} disabled={isSubmitting || !transcript}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Assessment
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
