'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Mic, Square, Loader2, Info, Play, Pause, Trash2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Progress } from './ui/progress';
import { Card } from './ui/card';

// --- Helper Components ---

interface AudioVisualizerProps {
  mediaStream: MediaStream | null;
  isRecording: boolean;
}

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ mediaStream, isRecording }) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    if (!mediaStream || !canvasRef.current) return;

    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaStreamSource(mediaStream);
    source.connect(analyser);

    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const canvas = canvasRef.current;
    const canvasCtx = canvas.getContext('2d');
    let animationFrameId: number;

    const draw = () => {
      animationFrameId = requestAnimationFrame(draw);
      analyser.getByteTimeDomainData(dataArray);
      
      if (canvasCtx) {
        canvasCtx.fillStyle = 'hsl(var(--muted))';
        canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
        canvasCtx.lineWidth = 2;
        canvasCtx.strokeStyle = 'hsl(var(--primary))';
        canvasCtx.beginPath();

        const sliceWidth = (canvas.width * 1.0) / bufferLength;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const v = dataArray[i] / 128.0;
          const y = (v * canvas.height) / 2;

          if (i === 0) {
            canvasCtx.moveTo(x, y);
          } else {
            canvasCtx.lineTo(x, y);
          }

          x += sliceWidth;
        }

        canvasCtx.lineTo(canvas.width, canvas.height / 2);
        canvasCtx.stroke();
      }
    };
    
    if (isRecording) {
      draw();
    } else if (canvasCtx) {
        // Clear canvas when not recording
        canvasCtx.fillStyle = 'hsl(var(--muted))';
        canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
    }


    return () => {
      cancelAnimationFrame(animationFrameId);
      source.disconnect();
      audioContext.close();
    };
  }, [mediaStream, isRecording]);

  return <canvas ref={canvasRef} className="w-full h-24 rounded-md" />;
};


// --- Main Component ---

interface SpeechRecorderProps {
  onRecordingComplete: (audioBlob: Blob, duration: number) => void;
  maxDuration?: number; // in seconds
  instructions?: string;
  onError?: (error: string) => void;
}


export function AudioRecorder({ onRecordingComplete, maxDuration = 60, instructions, onError }: SpeechRecorderProps) {
  const { toast } = useToast();
  const [hasMicPermission, setHasMicPermission] = React.useState(false);
  const [isRecording, setIsRecording] = React.useState(false);
  const [isPaused, setIsPaused] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [recordedBlob, setRecordedBlob] = React.useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = React.useState<string | null>(null);
  const [recordingTime, setRecordingTime] = React.useState(0);
  
  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null);
  const mediaStreamRef = React.useRef<MediaStream | null>(null);
  const timerIntervalRef = React.useRef<NodeJS.Timeout | null>(null);
  
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  React.useEffect(() => {
    async function getMicPermission() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: {
            sampleRate: 16000,
            channelCount: 1,
        } });
        mediaStreamRef.current = stream;
        setHasMicPermission(true);
      } catch (error) {
        console.error('Error accessing microphone:', error);
        setHasMicPermission(false);
        const errorMessage = 'Microphone access denied. Please enable it in your browser settings.';
        if(onError) onError(errorMessage);
        toast({
          variant: 'destructive',
          title: 'Microphone Access Denied',
          description: errorMessage,
        });
      }
    }
    getMicPermission();
    
    return () => {
        // Cleanup stream and timer on component unmount
        if (mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach(track => track.stop());
        }
        if (timerIntervalRef.current) {
            clearInterval(timerIntervalRef.current);
        }
    }
  }, [toast, onError]);

  const startTimer = () => {
    timerIntervalRef.current = setInterval(() => {
        setRecordingTime(prevTime => {
            if (prevTime >= maxDuration) {
                stopRecording();
                return maxDuration;
            }
            return prevTime + 1;
        });
    }, 1000);
  };
  
  const stopTimer = () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
  }

  const startRecording = () => {
    if (!mediaStreamRef.current) return;
    setIsRecording(true);
    setIsPaused(false);
    setRecordedBlob(null);
    if(audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    setRecordingTime(0);

    mediaRecorderRef.current = new MediaRecorder(mediaStreamRef.current, { mimeType: 'audio/webm' });
    const audioChunks: Blob[] = [];

    mediaRecorderRef.current.ondataavailable = event => {
      audioChunks.push(event.data);
    };

    mediaRecorderRef.current.onstop = () => {
      const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
      setRecordedBlob(audioBlob);
      const url = URL.createObjectURL(audioBlob);
      setAudioUrl(url);
    };

    mediaRecorderRef.current.start();
    startTimer();
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      stopTimer();
    }
  };
  
  const togglePauseResume = () => {
    if (mediaRecorderRef.current) {
        if(isPaused) {
            mediaRecorderRef.current.resume();
            startTimer();
        } else {
            mediaRecorderRef.current.pause();
            stopTimer();
        }
        setIsPaused(!isPaused);
    }
  }

  const resetRecording = () => {
      stopRecording();
      setRecordedBlob(null);
      if(audioUrl) URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
      setRecordingTime(0);
      setIsPaused(false);
  }

  const handleSubmit = async () => {
    if (!recordedBlob) return;
    setIsSubmitting(true);
    
    // Pass blob and duration to parent
    onRecordingComplete(recordedBlob, recordingTime);
    
    // Simulate an API call
    await new Promise(res => setTimeout(res, 1500));
    toast({
        title: 'Assessment Submitted',
        description: 'The speech recording has been saved for analysis.',
    });
    setIsSubmitting(false);
    resetRecording();
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
          
      {instructions && <p className="text-muted-foreground">{instructions}</p>}

      <Card className="bg-muted p-4 space-y-4">
        <AudioVisualizer mediaStream={mediaStreamRef.current} isRecording={isRecording && !isPaused} />
        
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                <p className="text-sm font-mono text-foreground" data-testid="timer">
                    {formatTime(recordingTime)} / {formatTime(maxDuration)}
                </p>
                {isRecording && <Progress value={(recordingTime/maxDuration) * 100} className="w-32 h-2" />}
            </div>

            <div className="flex items-center gap-2">
                {!isRecording && !recordedBlob && (
                    <Button onClick={startRecording} disabled={!hasMicPermission} size="lg" aria-label="Start recording">
                        <Mic className="mr-2 h-5 w-5" /> Start Recording
                    </Button>
                )}
                
                {isRecording && (
                    <>
                    <Button onClick={togglePauseResume} variant="secondary" size="icon" aria-label={isPaused ? 'Resume recording' : 'Pause recording'}>
                       {isPaused ? <Play /> : <Pause />}
                    </Button>
                     <Button onClick={stopRecording} variant="destructive" size="icon" aria-label="Stop recording">
                        <Square />
                    </Button>
                    </>
                )}
            </div>
        </div>
      </Card>
      
      {audioUrl && recordedBlob && (
        <Card className="p-4 space-y-4">
            <h3 className="font-medium">Review Recording</h3>
            <audio controls src={audioUrl} className="w-full">
                Your browser does not support the audio element.
            </audio>
            <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={resetRecording} disabled={isSubmitting} aria-label="Discard recording">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Discard
                </Button>
                <Button onClick={handleSubmit} disabled={isSubmitting} aria-label="Save assessment">
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Assessment
                </Button>
            </div>
        </Card>
      )}

    </div>
  );
}
