
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, FileText, BarChart2, Clock, CheckCircle, AlertTriangle, UserPlus, FileUp } from 'lucide-react';

const overviewMetrics = [
    { title: 'Total Patients', value: '1,247', icon: Users, change: '+12 since last month' },
    { title: 'Assessments Completed', value: '892', icon: FileText, change: '+56 in last 7 days' },
    { title: 'Average Risk Score', value: '34%', icon: BarChart2, change: '-2% from last week' },
    { title: 'System Uptime', value: '99.98%', icon: CheckCircle, change: '24/7 Monitoring Active' },
]

const recentActivities = [
    { type: 'New User', description: 'Dr. Anya Sharma registered.', icon: UserPlus, time: '2m ago' },
    { type: 'Assessment Completed', description: 'Patient John Doe (ID: pat_1) assessment processed. High risk detected.', icon: FileUp, time: '5m ago', variant: 'destructive' },
    { type: 'System Alert', description: 'API response time for /api/assessments/analyze exceeded 5s threshold.', icon: AlertTriangle, time: '15m ago', variant: 'destructive' },
    { type: 'New User', description: 'Dr. Ben Carter registered.', icon: UserPlus, time: '30m ago' },
    { type: 'Assessment Completed', description: 'Patient Eleanor Vance (ID: pat_2) assessment processed. Low risk.', icon: FileUp, time: '1h ago', variant: 'default' },
]


export default function AdminPage() {
  return (
    <div className="space-y-8">
       <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Real-time overview of system health, user activity, and key metrics.
        </p>
      </div>

       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {overviewMetrics.map(metric => {
            const Icon = metric.icon;
            return (
                 <Card key={metric.title}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                        {metric.title}
                        </CardTitle>
                        <Icon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{metric.value}</div>
                        <p className="text-xs text-muted-foreground">
                        {metric.change}
                        </p>
                    </CardContent>
                </Card>
            )
        })}
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
            <CardHeader>
                <CardTitle>Assessment Trends</CardTitle>
                <CardDescription>Daily/Weekly/Monthly assessment volumes.</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-80 bg-muted rounded-lg">
                <p className="text-muted-foreground">[Line Chart Placeholder]</p>
            </CardContent>
        </Card>
         <Card className="lg:col-span-3">
            <CardHeader>
                <CardTitle>Real-time Activity Feed</CardTitle>
                <CardDescription>Live feed of user and system events.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {recentActivities.map(activity => {
                    const Icon = activity.icon;
                    return (
                        <div key={activity.description} className="flex items-start gap-4">
                            <div className="bg-muted p-2 rounded-full">
                                <Icon className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <div>
                                <div className="text-sm font-medium">{activity.type} <Badge variant={activity.variant as any} className="ml-2">{activity.variant}</Badge></div>
                                <p className="text-sm text-muted-foreground">{activity.description}</p>
                                <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                            </div>
                        </div>
                    )
                })}
            </CardContent>
        </Card>
      </div>

       <Card>
        <CardHeader>
          <CardTitle>System Management</CardTitle>
          <CardDescription>
            This section is for administrative use only. Future features will include a comprehensive User Management system with role-based access control (RBAC), a Data Browser for database management, robust Backup & Restore utilities, and a complete Audit Trail for security and compliance monitoring.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Full admin features are not yet implemented.</p>
        </CardContent>
      </Card>
    </div>
  );
}
