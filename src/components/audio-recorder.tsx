'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Mic, Square, Loader2, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

export function AudioRecorder() {
  const { toast } = useToast();
  const [hasMicPermission, setHasMicPermission] = React.useState(false);
  const [isRecording, setIsRecording] = React.useState(false);
  const [transcript, setTranscript] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    const getMicPermission = async () => {
      try {
        // We only need audio for this component
        await navigator.mediaDevices.getUserMedia({ audio: true });
        setHasMicPermission(true);
      } catch (error) {
        console.error('Error accessing microphone:', error);
        setHasMicPermission(false);
        toast({
          variant: 'destructive',
          title: 'Microphone Access Denied',
          description: 'Please enable microphone permissions in your browser settings.',
        });
      }
    };
    getMicPermission();
  }, [toast]);

  const handleToggleRecording = () => {
    if (isRecording) {
      // In a real app, you would stop the recording and speech-to-text process here.
      setIsRecording(false);
      // For demonstration, we populate with a sample transcript.
      setTranscript('The patient described their childhood home, recalling the "big oak tree in the front yard" and the "smell of freshly baked bread on Sundays." Speech was clear but somewhat slow. Some word-finding difficulty was noted when trying to recall the name of their elementary school.');
    } else {
      // In a real app, you would start the recording and speech-to-text process here.
      setIsRecording(true);
      setTranscript('');
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate an API call to save the assessment
    await new Promise(res => setTimeout(res, 1500));
    toast({
        title: 'Assessment Submitted',
        description: 'The speech assessment has been saved.',
    });
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-6">
       {!hasMicPermission && (
            <Alert variant="destructive">
                <Info className="h-4 w-4" />
              <AlertTitle>Microphone Access Required</AlertTitle>
              <AlertDescription>
                Please allow access to your microphone to proceed with the assessment.
              </AlertDescription>
            </Alert>
          )}

      <div className="bg-muted rounded-lg p-4 flex flex-col items-center justify-center space-y-4 min-h-[150px]">
         {isRecording && <div className="text-sm text-muted-foreground">Recording...</div>}
        <Button
          onClick={handleToggleRecording}
          disabled={!hasMicPermission}
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
      <div className="flex justify-end">
          <Button onClick={handleSubmit} disabled={isSubmitting || !transcript || isRecording}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Assessment
          </Button>
        </div>
    </div>
  );
}
