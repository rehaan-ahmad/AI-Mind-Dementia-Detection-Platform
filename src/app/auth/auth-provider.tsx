
'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import type { Patient } from '@/lib/types';
import { patients as initialPatients } from '@/lib/data';
import { Loader2 } from 'lucide-react';

// As per your spec, defining user roles and permissions.
// This is a mock and is not connected to a database.
type UserRole = 'patient' | 'healthcare_provider' | 'admin';

interface User {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  permissions: string[];
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (user: User) => void;
  logout: () => void;
  patients: Patient[];
  addPatient: (patient: Omit<Patient, 'id'>) => void;
  deletePatient: (patientId: string) => void;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

// This is our mock user. We can change the role here to test different access levels.
// e.g., change 'admin' to 'healthcare_provider' to see the Admin Panel link disappear.
const mockUser: User = {
  uid: 'user-mock-123',
  email: 'e.reed@aimind-health.com',
  displayName: 'Dr. Evelyn Reed',
  role: 'admin', // <-- CHANGE THIS TO 'healthcare_provider' TO HIDE ADMIN LINK
  permissions: [
    'admin:all',
    'user:create',
    'user:read',
    'user:update',
    'user:delete',
    'system:configure',
    'audit:read'
  ]
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true); // Start with loading true
  const [patients, setPatients] = React.useState<Patient[]>(initialPatients);

  // In a real app, you would have a useEffect here to check for a Firebase session.
  React.useEffect(() => {
    // Simulate checking for an existing session
    const session = sessionStorage.getItem('aimind-user');
    if (session) {
      setUser(JSON.parse(session));
    }
    // Simulate a longer loading time to demonstrate skeleton loaders
    setTimeout(() => {
        setLoading(false);
    }, 1000);
  }, []);

  const login = (userData: User) => {
    sessionStorage.setItem('aimind-user', JSON.stringify(userData));
    setUser(userData);
    router.push('/dashboard');
  };

  const logout = () => {
    sessionStorage.removeItem('aimind-user');
    setUser(null);
    router.push('/login');
  };

  const addPatient = (patientData: Omit<Patient, 'id'>) => {
    const newPatient: Patient = {
        ...patientData,
        id: `pat_${Date.now()}`, // Create a unique ID for the mock patient
        avatarId: ['avatar1', 'avatar2', 'avatar3'][Math.floor(Math.random() * 3)],
        mriScanId: ['mri-scan-1', 'mri-scan-2', 'mri-scan-3'][Math.floor(Math.random() * 3)],
        riskAssessment: {
          level: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)] as 'Low' | 'Medium' | 'High',
          score: Math.floor(Math.random() * 80) + 10,
        },
        timeline: [
            { date: new Date().toISOString(), title: 'Patient Record Created', description: 'Initial patient data entered into the system.', icon: 'FileText' },
        ]
    };
    setPatients(prev => [newPatient, ...prev]);
  };

  const deletePatient = (patientId: string) => {
    setPatients(prev => prev.filter(p => p.id !== patientId));
  };


  const value = {
    user,
    loading,
    login,
    logout,
    patients,
    addPatient,
    deletePatient
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

    