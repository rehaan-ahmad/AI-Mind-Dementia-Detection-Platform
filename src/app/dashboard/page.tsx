
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
import { Checkbox } from '@/components/ui/checkbox';
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
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { Input } from '@/components/ui/input';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import type { Patient } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Users, AlertTriangle, ShieldCheck, HeartPulse, ArrowUpDown, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '../auth/auth-provider';
import { format } from 'date-fns';

type SortKey = 'name' | 'age' | 'riskAssessment.level';

function getAvatarUrl(patient: Patient) {
  const image = PlaceHolderImages.find((img) => img.id === patient.avatarId);
  return image ? image.imageUrl : 'https://picsum.photos/seed/placeholder/100/100';
}

function getRiskBadgeClass(level: Patient['riskAssessment']['level']) {
  switch (level) {
    case 'Low':
      return 'bg-[#059669]/90 text-white shadow-sm hover:bg-[#059669]/80';
    case 'Medium':
      return 'bg-[#D97706]/85 text-white shadow-sm hover:bg-[#D97706]/75';
    case 'High':
      return 'bg-[#DC2626]/90 text-white shadow-sm hover:bg-[#DC2626]/80 animate-pulse-slow';
    default:
      return 'bg-gray-500 text-white shadow-sm hover:bg-gray-500/80';
  }
}

const riskLevelOrder: { [key in Patient['riskAssessment']['level']]: number } = {
    'High': 3,
    'Medium': 2,
    'Low': 1,
};


const PatientRow = React.memo(({ patient, onDelete, isSelected, onSelect }: { patient: Patient, onDelete: (patientId: string) => void, isSelected: boolean, onSelect: (patientId: string, checked: boolean) => void }) => {
    return (
        <TableRow 
            data-state={isSelected ? 'selected' : ''}
            className="hover:bg-muted/50 even:bg-[#FAFAF9] dark:even:bg-[#1F2937] border-b border-border transition-transform duration-300 ease-in-out hover:scale-[1.01] data-[state=selected]:bg-primary/10 data-[state=selected]:shadow-md data-[state=selected]:border-l-4 data-[state=selected]:border-l-primary"
        >
             <TableCell className="p-2">
                <Checkbox
                    checked={isSelected}
                    onCheckedChange={(checked) => onSelect(patient.id, !!checked)}
                    aria-label={`Select patient ${patient.name}`}
                />
            </TableCell>
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
            <TableCell className="font-medium text-foreground">
                <div className="truncate" title={patient.name}>{patient.name}</div>
            </TableCell>
            <TableCell className="text-muted-foreground">{patient.age}</TableCell>
            <TableCell className="hidden md:table-cell text-muted-foreground">
            {patient.gender}
            </TableCell>
            <TableCell>
            <Badge className={cn("font-semibold py-1.5 px-3 text-xs rounded-full", getRiskBadgeClass(patient.riskAssessment.level))}>
                {patient.riskAssessment.level} <span className="sr-only"> Risk</span>
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
                        <span className="sr-only">Toggle menu for {patient.name}</span>
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
    const [lastUpdated, setLastUpdated] = React.useState(new Date());
    const [selectedRows, setSelectedRows] = React.useState<Set<string>>(new Set());

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
        setSelectedRows(prev => {
            const newSet = new Set(prev);
            newSet.delete(patientId);
            return newSet;
        });
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
    
    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedRows(new Set(sortedAndFilteredPatients.map(p => p.id)));
        } else {
            setSelectedRows(new Set());
        }
    };
    
    const handleSelectRow = (patientId: string, checked: boolean) => {
        setSelectedRows(prev => {
            const newSet = new Set(prev);
            if (checked) {
                newSet.add(patientId);
            } else {
                newSet.delete(patientId);
            }
            return newSet;
        });
    };

    const SortableHeader = ({ sortKey: key, children, className }: { sortKey: SortKey, children: React.ReactNode, className?: string }) => (
        <TableHead className={cn("text-muted-foreground", className)}>
            <Button variant="ghost" onClick={() => handleSort(key)} className="px-2 font-semibold text-sm">
                {children}
                {sortKey === key && <ArrowUpDown className="ml-2 h-4 w-4" />}
            </Button>
        </TableHead>
    );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground leading-snug">Patient Dashboard</h1>
        <div className="flex items-center gap-2 mt-1">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
            <p className="text-xs text-muted-foreground">
            Last updated: {format(lastUpdated, "PPP p")}
            </p>
        </div>
      </div>

       <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 animate-fade-in-up">
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Card className="shadow-soft">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
                            <CardTitle className="text-sm font-medium">
                            Total Patients
                            </CardTitle>
                            <Users className="h-5 w-5 text-muted-foreground" />
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                            <div className="text-2xl font-bold">{totalPatients}</div>
                            <p className="text-xs text-muted-foreground sr-only">
                            All patients in the system
                            </p>
                        </CardContent>
                    </Card>
                </TooltipTrigger>
                <TooltipContent>
                    <p>All patients currently managed in the system.</p>
                </TooltipContent>
            </Tooltip>
            <Tooltip>
                 <TooltipTrigger asChild>
                    <Card className="shadow-soft">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
                            <CardTitle className="text-sm font-medium">
                            High-Risk
                            </CardTitle>
                            <AlertTriangle className="h-5 w-5 text-destructive" />
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                            <div className="text-2xl font-bold">{highRiskPatients}</div>
                            <p className="text-xs text-muted-foreground sr-only">
                                Patients requiring immediate attention
                            </p>
                        </CardContent>
                    </Card>
                </TooltipTrigger>
                <TooltipContent>
                     <p>Number of high-risk patients requiring immediate attention.</p>
                </TooltipContent>
            </Tooltip>
            <Tooltip>
                 <TooltipTrigger asChild>
                    <Card className="shadow-soft">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
                        <CardTitle className="text-sm font-medium">Medium-Risk</CardTitle>
                        <HeartPulse className="h-5 w-5 text-amber-500" />
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                        <div className="text-2xl font-bold">{mediumRiskPatients}</div>
                        <p className="text-xs text-muted-foreground sr-only">
                            Patients requiring monitoring
                        </p>
                    </CardContent>
                    </Card>
                </TooltipTrigger>
                 <TooltipContent>
                    <p>Number of medium-risk patients who require monitoring.</p>
                </TooltipContent>
            </Tooltip>
             <Tooltip>
                 <TooltipTrigger asChild>
                    <Card className="shadow-soft">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
                        <CardTitle className="text-sm font-medium">Low-Risk</CardTitle>
                        <ShieldCheck className="h-5 w-5 text-green-500" />
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                        <div className="text-2xl font-bold">{lowRiskPatients}</div>
                        <p className="text-xs text-muted-foreground sr-only">
                            Patients with stable assessments
                        </p>
                    </CardContent>
                    </Card>
                </TooltipTrigger>
                 <TooltipContent>
                    <p>Number of low-risk patients with stable assessments.</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
      </div>

      <Card className="shadow-soft animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <CardTitle className="text-xl font-medium leading-snug">Patient List</CardTitle>
                    <CardDescription className="leading-normal">
                        A list of all patients currently in the system.
                    </CardDescription>
                </div>
                <div className="relative w-full sm:w-auto">
                    <label htmlFor="patient-search" className="sr-only">Search by patient name</label>
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                        id="patient-search"
                        placeholder="Search by patient name..." 
                        className="pl-8 sm:w-[300px] rounded-md bg-[#F9FAFB] border-[#D1D5DB] placeholder:text-[#6B7280] dark:bg-[#374151] dark:border-[#6B7280] dark:placeholder:text-[#D1D5DB]"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    />
                </div>
            </div>
        </CardHeader>
        <CardContent>
            {sortedAndFilteredPatients.length > 0 ? (
                <div className="border rounded-lg overflow-hidden">
                    <Table>
                    <TableHeader className="bg-[#F3F4F6] dark:bg-muted">
                        <TableRow className="hover:bg-transparent border-b border-border">
                            <TableHead className="p-2 w-[40px]">
                                <Checkbox
                                    onCheckedChange={(checked) => handleSelectAll(!!checked)}
                                    checked={selectedRows.size > 0 && selectedRows.size === sortedAndFilteredPatients.length}
                                    aria-label="Select all rows"
                                />
                            </TableHead>
                        <TableHead className="hidden w-[60px] sm:table-cell p-2">
                            <span className="sr-only">Avatar</span>
                        </TableHead>
                        <SortableHeader sortKey="name">Name</SortableHeader>
                        <SortableHeader sortKey="age">Age</SortableHeader>
                        <TableHead className="hidden md:table-cell font-semibold text-sm text-muted-foreground">Gender</TableHead>
                        <SortableHeader sortKey="riskAssessment.level">Risk Level</SortableHeader>
                        <TableHead>
                            <span className="sr-only">Actions</span>
                        </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sortedAndFilteredPatients.map((patient) => (
                        <PatientRow key={patient.id} patient={patient} onDelete={handleDeletePatient} isSelected={selectedRows.has(patient.id)} onSelect={handleSelectRow}/>
                        ))}
                    </TableBody>
                    </Table>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center text-center p-12 border-2 border-dashed rounded-lg">
                    <Users className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-xl font-medium">No Patients Found</h3>
                    <p className="text-muted-foreground mt-2">
                        Add a new patient to get started.
                    </p>
                     <Button asChild className="mt-4">
                        <Link href="/patients/new">Add New Patient</Link>
                    </Button>
                </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}

    