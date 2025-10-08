
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
import { patients } from '@/lib/data';
import { ArrowLeft, Bot, Loader2 } from 'lucide-react';
import { AudioRecorder } from '@/components/audio-recorder';
import { analyzeSpeechForDementiaIndicators, type AnalyzeSpeechForDementiaIndicatorsOutput } from '@/ai/flows/analyze-speech-for-dementia-indicators';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';

export default function SpeechAssessmentPage({ params }: { params: { id: string } }) {
  const patient = patients.find((p) => p.id === params.id);
  const { toast } = useToast();
  
  const [analysisResult, setAnalysisResult] = React.useState<AnalyzeSpeechForDementiaIndicatorsOutput | null>(null);
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  if (!patient) {
    notFound();
  }

  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
            if (typeof reader.result === 'string') {
                resolve(reader.result);
            } else {
                reject('Failed to convert blob to base64');
            }
        };
        reader.onerror = (error) => reject(error);
    });
  }

  const handleRecordingComplete = async (audioBlob: Blob, duration: number) => {
    setIsAnalyzing(true);
    setAnalysisResult(null);
    setError(null);
    
    try {
        const audioDataUri = await blobToBase64(audioBlob);
        
        const result = await analyzeSpeechForDementiaIndicators({
            audioDataUri: audioDataUri,
        });

        setAnalysisResult(result);
        toast({
            title: 'Analysis Complete',
            description: 'The speech analysis has been successfully completed.',
        });

    } catch (e: any) {
        console.error("Analysis Error:", e);
        setError('An error occurred during speech analysis. Please try again.');
        toast({
            variant: 'destructive',
            title: 'Analysis Failed',
            description: e.message || 'An unknown error occurred.',
        });
    } finally {
        setIsAnalyzing(false);
    }
  };

  const handleRecorderError = (error: string) => {
    console.error("Recorder Error:", error);
    setError(error);
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
            onError={handleRecorderError}
            maxDuration={120} // 2 minutes
            instructions="Please press 'Start Recording' and ask the patient to speak clearly. The recording will stop automatically after 2 minutes."
            disabled={isAnalyzing}
          />
        </CardContent>
      </Card>

      {(isAnalyzing || analysisResult || error) && (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Bot className="h-5 w-5" />
                    AI Analysis Results
                </CardTitle>
                <CardDescription>
                    The results from the speech analysis are shown below.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {isAnalyzing && (
                    <div className="flex items-center gap-4">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <p>Analyzing audio... This may take a moment.</p>
                    </div>
                )}
                {error && <p className="text-destructive">{error}</p>}
                {analysisResult && (
                    <div className="space-y-6">
                        <div>
                            <h3 className="font-semibold">Risk Assessment</h3>
                            <div className="flex items-center gap-4 mt-2">
                                <span className="text-lg font-mono">{Math.round(analysisResult.risk_probability * 100)}%</span>
                                <Progress value={analysisResult.risk_probability * 100} className="w-1/2" />
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">Probability of dementia indicators present in speech.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div>
                                <h4 className="font-semibold mb-2">Linguistic Features</h4>
                                <ul className="space-y-1 list-disc list-inside text-sm text-muted-foreground">
                                    <li>Word-finding difficulty: <span className="font-medium text-foreground">{analysisResult.linguistic_features.wordFindingDifficulty ? 'Detected' : 'Not Detected'}</span></li>
                                    <li>Sentence fragmentation: <span className="font-medium text-foreground">{analysisResult.linguistic_features.sentenceFragmentation ? 'Detected' : 'Not Detected'}</span></li>
                                    <li>Repetition: <span className="font-medium text-foreground">{analysisResult.linguistic_features.repetition ? 'Detected' : 'Not Detected'}</span></li>
                                    <li>Loss of coherence: <span className="font-medium text-foreground">{analysisResult.linguistic_features.lossOfCoherence ? 'Detected' : 'Not Detected'}</span></li>
                                </ul>
                           </div>
                             <div>
                                <h4 className="font-semibold mb-2">Acoustic Features</h4>
                                <ul className="space-y-1 list-disc list-inside text-sm text-muted-foreground">
                                    <li>Speech Rate: <span className="font-medium text-foreground">{analysisResult.acoustic_features.speechRate.toFixed(1)} wpm</span></li>
                                    <li>Pitch Variability: <span className="font-medium text-foreground">{analysisResult.acoustic_features.pitchVariability}</span></li>
                                    <li>Hesitation Ratio: <span className="font-medium text-foreground">{(analysisResult.acoustic_features.hesitationRatio * 100).toFixed(1)}%</span></li>
                                </ul>
                           </div>
                        </div>
                         <div>
                            <h4 className="font-semibold mb-2">Key Indicators Observed</h4>
                            <div className="flex flex-wrap gap-2">
                                {analysisResult.key_indicators.map(indicator => (
                                    <span key={indicator} className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-md">{indicator}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
             {analysisResult && (
                <CardFooter className="flex justify-end">
                    <Button>Save Results to Patient Record</Button>
                </CardFooter>
             )}
        </Card>
      )}

    </div>
  );
}
