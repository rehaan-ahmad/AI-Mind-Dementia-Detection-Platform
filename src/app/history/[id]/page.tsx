
'use client';

import { notFound } from 'next/navigation';
import Link from 'next/link';
import * as React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { patients } from '@/lib/data';
import type { Patient, TimelineEvent } from '@/lib/types';
import { ArrowLeft, Stethoscope, FileText, Scan, Pill, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';

const iconMap: { [key in TimelineEvent['icon']]: React.ElementType } = {
  Stethoscope,
  FileText,
  Scan,
  Pill,
  AlertTriangle,
};

function TimelineItem({ event, isLast }: { event: TimelineEvent, isLast: boolean }) {
  const Icon = iconMap[event.icon];
  return (
    <li className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className="flex items-center justify-center bg-primary rounded-full h-10 w-10">
          <Icon className="h-5 w-5 text-primary-foreground" />
        </div>
        {!isLast && <div className="w-px h-full bg-border" />}
      </div>
      <div className="pb-8">
        <p className="text-sm text-muted-foreground">{format(new Date(event.date), 'PPP')}</p>
        <p className="font-semibold">{event.title}</p>
        <p className="text-sm text-muted-foreground">{event.description}</p>
      </div>
    </li>
  );
}

export default function PatientHistoryPage({
  params,
}: {
  params: { id: string };
}) {
  const patient = patients.find((p) => p.id === params.id);


  if (!patient) {
    notFound();
  }
  
  // Sort timeline events chronologically, most recent first
  const sortedTimeline = [...patient.timeline].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="max-w-3xl mx-auto space-y-8">
       <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
            <Link href={`/patients/${patient.id}`}>
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back to Patient Details</span>
            </Link>
            </Button>
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Patient History Timeline</h1>
                <p className="text-muted-foreground">
                    A chronological record for {patient.name}
                </p>
            </div>
        </div>

      <Card>
        <CardHeader>
          <CardTitle>Timeline</CardTitle>
          <CardDescription>
            A chronological view of the patient's interactions and key health events.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <ul>
                {sortedTimeline.map((event, index) => (
                    <TimelineItem 
                        key={event.date + event.title} 
                        event={event} 
                        isLast={index === sortedTimeline.length - 1} 
                    />
                ))}
            </ul>
        </CardContent>
      </Card>
    </div>
  );
}
