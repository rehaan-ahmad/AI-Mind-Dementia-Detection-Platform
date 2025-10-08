
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
import { useToast } from '@/hooks/use-toast';
import { patients } from '@/lib/data';
import { ArrowLeft, Video, Square, Loader2, Info } from 'lucide-react';

export default function GaitAssessmentPage({ params }: { params: { id: string } }) {
  const patientId = params.id;
  const patient = React.useMemo(() => patients.find((p) => p.id === patientId), [patientId]);
  const { toast } = useToast();

  const [hasCameraPermission, setHasCameraPermission] = React.useState(false);
  const [isCollecting, setIsCollecting] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  
  const videoRef = React.useRef<HTMLVideoElement>(null);

  React.useEffect(() => {
    const getCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        setHasCameraPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Please enable camera permissions in your browser settings to perform the gait assessment.',
        });
      }
    };

    getCameraPermission();
  }, [toast]);


  const handleToggleCollection = () => {
    if (isCollecting) {
      // Logic to stop collection would go here
      setIsCollecting(false);
    } else {
      // Logic to start collection would go here
      setIsCollecting(true);
    }
  };
  
  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate API call to process gait data
    await new Promise(res => setTimeout(res, 2000));
    toast({
        title: 'Assessment Submitted',
        description: 'The gait assessment has been saved and is being processed.',
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
          <h1 className="text-3xl font-bold tracking-tight">Gait Assessment</h1>
          <p className="text-muted-foreground">
            For patient: {patient.name}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Record Patient's Gait</CardTitle>
          <CardDescription>
            Ask the patient to walk in a straight line for about 10 meters. Record the video for analysis.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!hasCameraPermission && (
            <Alert variant="destructive">
                <Info className="h-4 w-4" />
              <AlertTitle>Camera Access Required</AlertTitle>
              <AlertDescription>
                Please allow access to your camera to proceed with the assessment.
              </AlertDescription>
            </Alert>
          )}
          
          <div className="bg-muted rounded-lg p-4 flex flex-col items-center justify-center space-y-4 min-h-[400px]">
            <video ref={videoRef} className="w-full aspect-video rounded-md bg-background" autoPlay muted playsInline />
            <Button
              onClick={handleToggleCollection}
              disabled={!hasCameraPermission}
              size="lg"
              variant={isCollecting ? 'destructive' : 'default'}
            >
              {isCollecting ? (
                <>
                  <Square className="mr-2 h-5 w-5" />
                  Stop Collection
                </>
              ) : (
                <>
                  <Video className="mr-2 h-5 w-5" />
                  Start Collection
                </>
              )}
            </Button>
          </div>

        </CardContent>
        <CardFooter className="flex justify-end">
          <Button onClick={handleSubmit} disabled={isSubmitting || isCollecting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Assessment
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

