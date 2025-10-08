
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
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
} from "@/components/ui/alert-dialog"

export default function SettingsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>
            Update your personal information.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" defaultValue="Dr. Evelyn Reed" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" defaultValue="e.reed@aimind-health.com" />
          </div>
        </CardContent>
        <CardFooter>
          <Button>Save Profile</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Password</CardTitle>
          <CardDescription>
            Change your password. It's a good practice to use a strong password that you don't use elsewhere.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password">Current Password</Label>
            <Input id="current-password" type="password" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-password">New Password</Label>
            <Input id="new-password" type="password" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm New Password</Label>
            <Input id="confirm-password" type="password" />
          </div>
        </CardContent>
        <CardFooter>
          <Button>Update Password</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>
            Manage how you receive notifications from the platform.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
           <div className="flex items-center justify-between p-4 rounded-lg border">
              <div>
                <Label htmlFor="email-notifications" className="font-medium">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive important updates via email.</p>
              </div>
              <Switch id="email-notifications" defaultChecked />
            </div>
             <div className="flex items-center justify-between p-4 rounded-lg border">
              <div>
                <Label htmlFor="push-notifications" className="font-medium">Push Notifications</Label>
                <p className="text-sm text-muted-foreground">Get notified directly on your device.</p>
              </div>
              <Switch id="push-notifications" />
            </div>
        </CardContent>
         <CardFooter>
          <Button>Save Preferences</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Data & Privacy</CardTitle>
          <CardDescription>
            Manage your data, privacy settings, and consent options.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div>
              <h4 className="font-medium mb-2">Consent Management</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div>
                    <Label htmlFor="consent-collection" className="font-medium">Data Collection</Label>
                    <p className="text-sm text-muted-foreground">Allow collection of clinical data for assessment.</p>
                  </div>
                  <Switch id="consent-collection" defaultChecked disabled />
                </div>
                 <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div>
                    <Label htmlFor="consent-ai" className="font-medium">AI Analysis</Label>
                    <p className="text-sm text-muted-foreground">Allow AI models to process data for risk assessment.</p>
                  </div>
                  <Switch id="consent-ai" defaultChecked />
                </div>
                 <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div>
                    <Label htmlFor="consent-research" className="font-medium">Research Participation</Label>
                    <p className="text-sm text-muted-foreground">Allow anonymized data to be used for research.</p>
                  </div>
                  <Switch id="consent-research" />
                </div>
              </div>
            </div>
            <Separator />
            <div>
                <h4 className="font-medium mb-2">Data Management</h4>
                <div className="flex flex-col sm:flex-row gap-4">
                    <Button variant="outline" className="w-full sm:w-auto">Export My Data</Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" className="w-full sm:w-auto">Delete My Account</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your
                            account and remove all your data from our servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                </div>
                 <p className="text-xs text-muted-foreground mt-2">
                    Request an export of your data or the deletion of your account.
                 </p>
            </div>
        </CardContent>
         <CardFooter>
          <Button>Save Privacy Settings</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
