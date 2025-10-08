
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { patients } from '@/lib/data';
import type { Patient } from '@/lib/types';
import { generateRecommendations } from '@/ai/flows/generate-recommendations';
import { ArrowLeft, Brain, Activity, MessageSquare, Footprints, Stethoscope, FileText, Scan, AlertTriangle } from 'lucide-react';
import { RiskFactorChart } from '@/components/risk-factor-chart';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';


function getRiskBadgeVariant(level: Patient['riskAssessment']['level']) {
  switch (level) {
    case 'Low':
      return 'default';
    case 'Medium':
      return 'secondary';
    case 'High':
      return 'destructive';
    default:
      return 'outline';
  }
}

// Mock data for modality scores - in a real app, this would come from the backend
const modalityScores = [
    { name: 'Cognitive Tests', score: 75, icon: FileText, description: "Based on MMSE, MoCA etc." },
    { name: 'Functional Assessment', score: 85, icon: Activity, description: "ADLs & physical exam" },
    { name: 'Speech Analysis', score: 60, icon: MessageSquare, description: "Result from AI assessment" },
    { name: 'Gait Analysis', score: 70, icon: Footprints, description: "Result from AI assessment" },
];

const iconMap: { [key: string]: React.ElementType } = {
    'Cognitive Function': Brain,
    'Speech & Language': MessageSquare,
    'Physical Health': Stethoscope,
    'Imaging': Scan,
    'Functional Assessment': Activity,
    'Gait': Footprints,
    'Default': AlertTriangle
};

export default async function ResultsDashboardPage({
  params,
}: {
  params: { id: string };
}) {
  const patient = patients.find((p) => p.id === params.id);

  if (!patient) {
    notFound();
  }
  
  const [recommendationsResult] = await Promise.all([
    generateRecommendations({
        patientData: JSON.stringify(patient),
    }),
  ]);

  const riskBadgeVariant = getRiskBadgeVariant(patient.riskAssessment.level);

  return (
    <div className="space-y-8">
       <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
            <Link href={`/patients/${patient.id}`}>
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back to Patient Details</span>
            </Link>
            </Button>
            <div>
            <h1 className="text-3xl font-bold tracking-tight">Results Dashboard</h1>
            <p className="text-muted-foreground">
                In-depth assessment results for {patient.name}
            </p>
            </div>
        </div>
        <Badge variant={riskBadgeVariant} className="text-base">
            {patient.riskAssessment.level} Risk ({patient.riskAssessment.score}%)
        </Badge>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Risk Factor Contribution</CardTitle>
            <CardDescription>
              Breakdown of how different factors contribute to the overall risk score.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RiskFactorChart />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Modality Scores</CardTitle>
            <CardDescription>
              Performance across different assessment types.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {modalityScores.map(modality => (
                <div key={modality.name} className="space-y-2">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                            <modality.icon className="h-5 w-5 text-muted-foreground mt-1" />
                            <div>
                                <p className="font-medium">{modality.name}</p>
                                <p className="text-xs text-muted-foreground">{modality.description}</p>
                            </div>
                        </div>
                        <p className="font-mono text-sm">{modality.score}%</p>
                    </div>
                    <Progress value={modality.score} />
                </div>
            ))}
          </CardContent>
        </Card>
      </div>

       <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Key Findings & AI Recommendations
          </CardTitle>
          <CardDescription>
            AI-identified areas of concern and suggestions for next steps.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead className="w-[200px]">Area</TableHead>
                    <TableHead>Recommendation</TableHead>
                    <TableHead className="w-[120px] text-right">Priority</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {recommendationsResult.recommendations.map(rec => {
                        const Icon = iconMap[rec.area] || iconMap['Default'];
                        return (
                            <TableRow key={rec.area}>
                                <TableCell className="font-medium">
                                    <div className="flex items-center gap-2">
                                        <Icon className="h-4 w-4 text-muted-foreground" />
                                        {rec.area}
                                    </div>
                                </TableCell>
                                <TableCell className="text-muted-foreground">{rec.recommendation}</TableCell>
                                <TableCell className="text-right">
                                    <Badge variant={rec.priority === 'High' ? 'destructive' : rec.priority === 'Medium' ? 'secondary' : 'outline'}>
                                        {rec.priority}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </CardContent>
      </Card>
    </div>
  );
}
