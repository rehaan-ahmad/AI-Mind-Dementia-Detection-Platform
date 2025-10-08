import type { Metadata } from 'next';
import './globals.css';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarInset,
  SidebarTrigger,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { UserNav } from '@/components/user-nav';
import { MainNav } from '@/components/main-nav';
import Link from 'next/link';
import { BrainCircuit } from 'lucide-react';
import { Toaster } from '@/components/ui/toaster';
import { Button } from '@/components/ui/button';
import { AuthProvider } from '@/app/auth/auth-provider';

export const metadata: Metadata = {
  title: 'AI-Mind Dementia Detection',
  description: 'An AI-powered platform for early dementia detection.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <AuthProvider>
          <SidebarProvider>
            <Sidebar>
              <SidebarHeader className="border-b">
                <Link
                  href="/"
                  className="flex items-center gap-2 font-semibold"
                  aria-label="AI-Mind Home"
                >
                  <BrainCircuit className="h-6 w-6 text-primary-foreground" />
                  <span className="text-lg text-primary-foreground">AI-Mind</span>
                </Link>
              </SidebarHeader>
              <SidebarContent>
                <MainNav />
              </SidebarContent>
              <SidebarFooter className="p-2">
                <Button variant="outline" className="w-full">Help & Support</Button>
              </SidebarFooter>
            </Sidebar>
            <SidebarInset>
              <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur-sm sm:px-6">
                <SidebarTrigger className="md:hidden" />
                <div className="flex-1" />
                <Button asChild>
                  <Link href="/patients/new">Add New Patient</Link>
                </Button>
                <UserNav />
              </header>
              <main className="flex-1 p-4 md:p-8">{children}</main>
            </SidebarInset>
          </SidebarProvider>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
