
'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BrainCircuit, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/app/auth/auth-provider';

// This is our mock user. We can change the role here to test different access levels.
// e.g., change 'admin' to 'healthcare_provider' to see the Admin Panel link disappear.
const mockUser = {
  uid: 'user-mock-123',
  email: 'e.reed@aimind-health.com',
  displayName: 'Dr. Evelyn Reed',
  role: 'admin' as const, // <-- CHANGE THIS TO 'healthcare_provider' TO HIDE ADMIN LINK
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

export default function LoginPage() {
  const { login } = useAuth();
  const { toast } = useToast();
  const [step, setStep] = React.useState<'credentials' | 'otp'>('credentials');
  const [isLoading, setIsLoading] = React.useState(false);
  const [email, setEmail] = React.useState('e.reed@aimind-health.com');

  const handleCredentialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      toast({
        title: 'OTP Sent',
        description: 'A one-time password has been sent to your email.',
      });
      setIsLoading(false);
      setStep('otp');
    }, 1500);
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      toast({
        title: 'Login Successful',
        description: 'Welcome back, Dr. Reed!',
      });
      login(mockUser);
      // The login function will handle the redirect
    }, 1500);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-md space-y-4">
         <div className="flex flex-col items-center justify-center space-y-2">
            <BrainCircuit className="h-10 w-10 text-primary" />
            <h1 className="text-2xl font-semibold tracking-tight">Welcome to AI-Mind</h1>
            <p className="text-sm text-muted-foreground">Sign in to access your dashboard</p>
         </div>
        <Card>
          {step === 'credentials' && (
            <form onSubmit={handleCredentialSubmit}>
              <CardHeader>
                <CardTitle>Sign In</CardTitle>
                <CardDescription>Enter your email and password to continue.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="dr.reed@aimind.com" 
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <Link href="#" className="ml-auto inline-block text-sm underline">
                      Forgot password?
                    </Link>
                  </div>
                  <Input id="password" type="password" required defaultValue="password123" />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Sign In
                </Button>
              </CardFooter>
            </form>
          )}

          {step === 'otp' && (
            <form onSubmit={handleOtpSubmit}>
              <CardHeader>
                <CardTitle>Enter OTP</CardTitle>
                <CardDescription>
                  Enter the 6-digit code sent to <span className="font-medium text-foreground">{email}</span>.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="otp">One-Time Password</Label>
                   <Input 
                    id="otp" 
                    type="text" 
                    inputMode="numeric" 
                    pattern="\d{6}"
                    maxLength={6} 
                    required 
                    placeholder="123456" 
                    />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Verify & Sign In
                </Button>
                 <Button variant="link" size="sm" onClick={() => setStep('credentials')}>
                    Back to email/password
                </Button>
              </CardFooter>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}
