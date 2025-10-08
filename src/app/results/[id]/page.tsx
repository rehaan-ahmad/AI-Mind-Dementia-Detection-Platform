
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
import { ArrowLeft, Brain, Activity, MessageSquare, Footprints, Stethoscope, FileText, Scan, AlertTriangle, Info } from 'lucide-react';
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
    { name: 'Cognitive', score: 75, icon: Brain },
    { name: 'Functional', score: 85, icon: Activity },
    { name: 'Speech', score: 60, icon: MessageSquare },
    { name: 'Gait', score: 70, icon: Footprints },
];

const recommendations = [
    {
        area: 'Cognitive Function',
        recommendation: 'Recommend follow-up neuropsychological testing to further evaluate memory and executive function domains. Suggest patient engages in mentally stimulating activities.',
        priority: 'High',
        icon: FileText
    },
    {
        area: 'Speech & Language',
        recommendation: 'Consider referral to a speech-language pathologist for a comprehensive evaluation of word-finding difficulties.',
        priority: 'Medium',
        icon: MessageSquare
    },
    {
        area: 'Physical Health',
        recommendation: 'Continue monitoring blood pressure and hyperlipidemia. Encourage regular physical activity as tolerated.',
        priority: 'Medium',
        icon: Stethoscope
    },
    {
        area: 'Imaging',
        recommendation: 'A follow-up MRI in 12-18 months could be considered to monitor for any changes in cortical atrophy or white matter disease.',
        priority: 'Low',
        icon: Scan
    }
]


export default async function ResultsDashboardPage({
  params,
}: {
  params: { id: string };
}) {
  const patient = patients.find((p) => p.id === params.id);

  if (!patient) {
    notFound();
  }
  
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
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <modality.icon className="h-5 w-5 text-muted-foreground" />
                            <p className="font-medium">{modality.name}</p>
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
                    {recommendations.map(rec => (
                    <TableRow key={rec.area}>
                        <TableCell className="font-medium flex items-center gap-2">
                            <rec.icon className="h-4 w-4 text-muted-foreground" />
                            {rec.area}
                        </TableCell>
                        <TableCell className="text-muted-foreground">{rec.recommendation}</TableCell>
                        <TableCell className="text-right">
                             <Badge variant={rec.priority === 'High' ? 'destructive' : rec.priority === 'Medium' ? 'secondary' : 'outline'}>
                                {rec.priority}
                            </Badge>
                        </TableCell>
                    </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
      </Card>
    </div>
  );
}
