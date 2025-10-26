
'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import type { Patient } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Users, AlertTriangle, ShieldCheck, HeartPulse, ArrowUpDown, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '../auth/auth-provider';

type SortKey = 'name' | 'age' | 'riskAssessment.level';

function getAvatarUrl(patient: Patient) {
  const image = PlaceHolderImages.find((img) => img.id === patient.avatarId);
  return image ? image.imageUrl : 'https://picsum.photos/seed/placeholder/100/100';
}

function getRiskBadgeClass(level: Patient['riskAssessment']['level']) {
  switch (level) {
    case 'Low':
      return 'bg-green-700 text-white shadow-sm hover:bg-green-700/80';
    case 'Medium':
      return 'bg-amber-600 text-white shadow-sm hover:bg-amber-600/80';
    case 'High':
      return 'bg-red-600 text-white shadow-md hover:bg-red-600/80';
    default:
      return 'bg-gray-500 text-white shadow-sm hover:bg-gray-500/80';
  }
}

const riskLevelOrder: { [key in Patient['riskAssessment']['level']]: number } = {
    'High': 3,
    'Medium': 2,
    'Low': 1,
};


const PatientRow = React.memo(({ patient, onDelete }: { patient: Patient, onDelete: (patientId: string) => void }) => {
    return (
        <TableRow className="hover:bg-muted/50 even:bg-slate-50 dark:even:bg-white/5 border-b border-slate-200 dark:border-slate-800">
            <TableCell className="hidden sm:table-cell p-2">
            <Image
                alt="Patient avatar"
                className="aspect-square rounded-full object-cover shadow-md"
                height="40"
                src={getAvatarUrl(patient)}
                width="40"
                data-ai-hint="person portrait"
            />
            </TableCell>
            <TableCell className="font-medium text-slate-900 dark:text-slate-50">{patient.name}</TableCell>
            <TableCell className="text-slate-600 dark:text-slate-400">{patient.age}</TableCell>
            <TableCell className="hidden md:table-cell text-slate-600 dark:text-slate-400">
            {patient.gender}
            </TableCell>
            <TableCell>
            <Badge className={cn("font-semibold py-1.5 px-3 text-xs", getRiskBadgeClass(patient.riskAssessment.level))}>
                {patient.riskAssessment.level}
            </Badge>
            </TableCell>
            <TableCell>
             <AlertDialog>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                    <Button
                        aria-haspopup="true"
                        size="icon"
                        variant="ghost"
                    >
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                    </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                        <Link href={`/patients/${patient.id}`}>View Details</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <AlertDialogTrigger asChild>
                        <DropdownMenuItem className="text-destructive focus:text-destructive">
                            Delete
                        </DropdownMenuItem>
                    </AlertDialogTrigger>
                    </DropdownMenuContent>
                </DropdownMenu>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete this
                        patient's data from our servers.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => onDelete(patient.id)}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            </TableCell>
        </TableRow>
    );
});
PatientRow.displayName = 'PatientRow';


export default function Dashboard() {
    const { toast } = useToast();
    const { patients, deletePatient } = useAuth();
    const [filter, setFilter] = React.useState('');
    const [sortKey, setSortKey] = React.useState<SortKey>('riskAssessment.level');
    const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('desc');

    const totalPatients = patients.length;
    const highRiskPatients = patients.filter(p => p.riskAssessment.level === 'High').length;
    const mediumRiskPatients = patients.filter(p => p.riskAssessment.level === 'Medium').length;
    const lowRiskPatients = patients.filter(p => p.riskAssessment.level === 'Low').length;

    const handleSort = (key: SortKey) => {
        if (sortKey === key) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortDirection('asc');
        }
    };
    
    const handleDeletePatient = (patientId: string) => {
        deletePatient(patientId);
        toast({
            title: 'Patient Deleted',
            description: 'The patient has been removed from the list.',
        })
    };

    const sortedAndFilteredPatients = React.useMemo(() => {
        return patients
            .filter(patient => patient.name.toLowerCase().includes(filter.toLowerCase()))
            .sort((a, b) => {
                let aValue, bValue;

                if (sortKey === 'riskAssessment.level') {
                    aValue = riskLevelOrder[a.riskAssessment.level];
                    bValue = riskLevelOrder[b.riskAssessment.level];
                } else if (sortKey === 'age') {
                    aValue = a.age;
                    bValue = b.age;
                } else { // name
                    aValue = a.name;
                    bValue = b.name;
                }

                if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
                if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
                return 0;
            });
    }, [patients, filter, sortKey, sortDirection]);

    const SortableHeader = ({ sortKey: key, children, className }: { sortKey: SortKey, children: React.ReactNode, className?: string }) => (
        <TableHead className={cn("text-slate-500 dark:text-slate-400", className)}>
            <Button variant="ghost" onClick={() => handleSort(key)} className="px-2 font-semibold text-sm">
                {children}
                {sortKey === key && <ArrowUpDown className="ml-2 h-4 w-4" />}
            </Button>
        </TableHead>
    );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Patient Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of all patients and their dementia risk assessments.
        </p>
      </div>

       <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-sm rounded-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
            <CardTitle className="text-sm font-medium">
              Total Patients
            </CardTitle>
            <Users className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold">{totalPatients}</div>
            <p className="text-xs text-muted-foreground">
              All patients in the system
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm rounded-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
            <CardTitle className="text-sm font-medium">
              High-Risk
            </CardTitle>
            <AlertTriangle className="h-5 w-5 text-red-500" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold">{highRiskPatients}</div>
            <p className="text-xs text-muted-foreground">
                Patients requiring immediate attention
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm rounded-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
            <CardTitle className="text-sm font-medium">Medium-Risk</CardTitle>
            <HeartPulse className="h-5 w-5 text-yellow-500" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold">{mediumRiskPatients}</div>
            <p className="text-xs text-muted-foreground">
              Patients requiring monitoring
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm rounded-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
            <CardTitle className="text-sm font-medium">Low-Risk</CardTitle>
             <ShieldCheck className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold">{lowRiskPatients}</div>
            <p className="text-xs text-muted-foreground">
              Patients with stable assessments
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm rounded-lg">
        <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <CardTitle className="text-xl">Patient List</CardTitle>
                    <CardDescription>
                        A list of all patients currently in the system.
                    </CardDescription>
                </div>
                <div className="relative w-full sm:w-auto">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                        placeholder="Filter by name..." 
                        className="pl-8 sm:w-[300px] rounded-md"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    />
                </div>
            </div>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50 dark:bg-slate-800">
                <TableRow className="hover:bg-transparent border-b border-slate-200 dark:border-slate-700">
                  <TableHead className="hidden w-[60px] sm:table-cell p-2">
                    <span className="sr-only">Avatar</span>
                  </TableHead>
                  <SortableHeader sortKey="name">Name</SortableHeader>
                  <SortableHeader sortKey="age">Age</SortableHeader>
                  <TableHead className="hidden md:table-cell font-semibold text-sm text-slate-500 dark:text-slate-400">Gender</TableHead>
                  <SortableHeader sortKey="riskAssessment.level">Risk Level</SortableHeader>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedAndFilteredPatients.map((patient) => (
                  <PatientRow key={patient.id} patient={patient} onDelete={handleDeletePatient} />
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

    

    