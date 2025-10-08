
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function AdminPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
       <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Panel</h1>
        <p className="text-muted-foreground">
          Manage system settings and users.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>System Management</CardTitle>
          <CardDescription>
            This section is for administrative use only. Future features will include user management, system configuration, and data backups.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Admin features are not yet implemented.</p>
        </CardContent>
      </Card>
    </div>
  );
}
