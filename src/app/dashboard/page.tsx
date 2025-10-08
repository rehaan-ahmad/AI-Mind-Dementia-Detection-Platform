
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
import { Input } from '@/components/ui/input';
import { patients } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import type { Patient } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Users, AlertTriangle, ShieldCheck, HeartPulse, ArrowUpDown, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

type SortKey = 'name' | 'age' | 'riskAssessment.level';

function getAvatarUrl(patient: Patient) {
  const image = PlaceHolderImages.find((img) => img.id === patient.avatarId);
  return image ? image.imageUrl : 'https://picsum.photos/seed/placeholder/100/100';
}

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

const riskLevelOrder: { [key in Patient['riskAssessment']['level']]: number } = {
    'High': 3,
    'Medium': 2,
    'Low': 1,
};


const PatientRow = React.memo(({ patient }: { patient: Patient }) => {
    return (
        <TableRow>
            <TableCell className="hidden sm:table-cell">
            <Image
                alt="Patient avatar"
                className="aspect-square rounded-full object-cover"
                height="64"
                src={getAvatarUrl(patient)}
                width="64"
                data-ai-hint="person portrait"
            />
            </TableCell>
            <TableCell className="font-medium">{patient.name}</TableCell>
            <TableCell>{patient.age}</TableCell>
            <TableCell className="hidden md:table-cell">
            {patient.gender}
            </TableCell>
            <TableCell>
            <Badge variant={getRiskBadgeVariant(patient.riskAssessment.level)}>
                {patient.riskAssessment.level}
            </Badge>
            </TableCell>
            <TableCell>
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
                <DropdownMenuItem className="text-destructive focus:text-destructive">
                    Delete
                </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            </TableCell>
        </TableRow>
    );
});
PatientRow.displayName = 'PatientRow';


export default function Dashboard() {
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
    }, [filter, sortKey, sortDirection]);

    const SortableHeader = ({ sortKey: key, children }: { sortKey: SortKey, children: React.ReactNode }) => (
        <TableHead>
            <Button variant="ghost" onClick={() => handleSort(key)} className="px-2">
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

       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Patients
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPatients}</div>
            <p className="text-xs text-muted-foreground">
              All patients in the system
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              High-Risk
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{highRiskPatients}</div>
            <p className="text-xs text-muted-foreground">
                Patients requiring immediate attention
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Medium-Risk</CardTitle>
            <HeartPulse className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mediumRiskPatients}</div>
            <p className="text-xs text-muted-foreground">
              Patients requiring monitoring
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low-Risk</CardTitle>
             <ShieldCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lowRiskPatients}</div>
            <p className="text-xs text-muted-foreground">
              Patients with stable assessments
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div>
                    <CardTitle>Patient List</CardTitle>
                    <CardDescription>
                        A list of all patients currently in the system.
                    </CardDescription>
                </div>
                <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                        placeholder="Filter by name..." 
                        className="pl-8 sm:w-[300px]"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    />
                </div>
            </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden w-[100px] sm:table-cell">
                  <span className="sr-only">Avatar</span>
                </TableHead>
                <SortableHeader sortKey="name">Name</SortableHeader>
                <SortableHeader sortKey="age">Age</SortableHeader>
                <TableHead className="hidden md:table-cell">Gender</TableHead>
                <SortableHeader sortKey="riskAssessment.level">Risk Level</SortableHeader>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedAndFilteredPatients.map((patient) => (
                <PatientRow key={patient.id} patient={patient} />
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
