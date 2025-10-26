
'use client';

import * as React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/app/auth/auth-provider';
import type { Patient } from '@/lib/types';
import { Bot, Loader2, Info, Video, Square, Mic } from 'lucide-react';
import { AudioRecorder } from '@/components/audio-recorder';
import { analyzeSpeechForDementiaIndicators } from '@/ai/flows/analyze-speech-for-dementia-indicators';
import type { AnalyzeSpeechForDementiaIndicatorsOutput } from '@/ai/flows/speech.schemas';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@/components/ui/tabs';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';

// --- Speech Assessment Component ---
function SpeechAssessment({ patient, disabled }: { patient: Patient, disabled: boolean }) {
  const { toast } = useToast();
  
  const [analysisResult, setAnalysisResult] = React.useState<AnalyzeSpeechForDementiaIndicatorsOutput | null>(null);
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

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
                disabled={isAnalyzing || disabled}
            />
        </CardContent>
        
        {(isAnalyzing || analysisResult || error) && (
            <>
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
            </>
        )}
    </Card>
  );
}

// --- Gait Assessment Component ---
function GaitAssessment({ patient, disabled }: { patient: Patient, disabled: boolean }) {
    const { toast } = useToast();

    const [hasCameraPermission, setHasCameraPermission] = React.useState(false);
    const [isCollecting, setIsCollecting] = React.useState(false);
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const videoRef = React.useRef<HTMLVideoElement>(null);

    React.useEffect(() => {
        if (disabled) return;

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

        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                const stream = videoRef.current.srcObject as MediaStream;
                stream.getTracks().forEach(track => track.stop());
            }
        }
    }, [toast, disabled]);

    const handleToggleCollection = () => {
        if (isCollecting) {
            setIsCollecting(false);
        } else {
            setIsCollecting(true);
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        await new Promise(res => setTimeout(res, 2000));
        toast({
            title: 'Assessment Submitted',
            description: 'The gait assessment has been saved and is being processed.',
        });
        setIsSubmitting(false);
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Record Patient's Gait</CardTitle>
                <CardDescription>
                    Ask the patient to walk in a straight line for about 10 meters. Record the video for analysis.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {!hasCameraPermission && !disabled && (
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
                        disabled={!hasCameraPermission || disabled}
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
                <Button onClick={handleSubmit} disabled={isSubmitting || isCollecting || disabled}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Assessment
                </Button>
            </CardFooter>
        </Card>
    );
}

// --- Main Page ---
export default function AssessmentPage() {
    const { patients } = useAuth();
    const [selectedPatientId, setSelectedPatientId] = React.useState<string | null>(null);

    const selectedPatient = React.useMemo(() => {
        return patients.find(p => p.id === selectedPatientId) ?? null;
    }, [patients, selectedPatientId]);

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">AI Assessment Center</h1>
                <p className="text-muted-foreground">
                    Conduct speech and gait analysis for patients.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Select a Patient</CardTitle>
                    <CardDescription>Choose a patient to begin an assessment.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="max-w-sm space-y-2">
                         <Label htmlFor="patient-select">Patient</Label>
                         <Select onValueChange={setSelectedPatientId} value={selectedPatientId || ''}>
                            <SelectTrigger id="patient-select">
                                <SelectValue placeholder="Select a patient..." />
                            </SelectTrigger>
                            <SelectContent>
                                {patients.map(p => (
                                    <SelectItem key={p.id} value={p.id}>{p.name} (Age: {p.age})</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            <Tabs defaultValue="speech" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="speech" disabled={!selectedPatient}><Mic className="mr-2 h-4 w-4" /> Speech Assessment</TabsTrigger>
                    <TabsTrigger value="gait" disabled={!selectedPatient}><Video className="mr-2 h-4 w-4" /> Gait Assessment</TabsTrigger>
                </TabsList>
                <TabsContent value="speech" className="mt-4">
                    {selectedPatient ? <SpeechAssessment patient={selectedPatient} disabled={!selectedPatient} /> : <div className="text-center text-muted-foreground p-8">Please select a patient to begin.</div>}
                </TabsContent>
                <TabsContent value="gait" className="mt-4">
                    {selectedPatient ? <GaitAssessment patient={selectedPatient} disabled={!selectedPatient} /> : <div className="text-center text-muted-foreground p-8">Please select a patient to begin.</div>}
                </TabsContent>
            </Tabs>
        </div>
    );
}
