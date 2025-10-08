'use client';

import * as React from 'react';

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
  const [user, setUser] = React.useState<User | null>(mockUser);
  const [loading, setLoading] = React.useState(false);

  // In a real app, you would have a useEffect here to check for a Firebase session.
  // For this mock, we just set the user directly.

  const value = {
    user,
    loading,
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
