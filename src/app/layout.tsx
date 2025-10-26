
'use client';
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
import { BrainCircuit, Loader2, LifeBuoy, LogOut, UserPlus } from 'lucide-react';
import { Toaster } from '@/components/ui/toaster';
import { Button } from '@/components/ui/button';
import { AuthProvider, useAuth } from '@/app/auth/auth-provider';
import { usePathname } from 'next/navigation';
import { ThemeProvider } from '@/components/theme-provider';
import { ThemeToggle } from '@/components/theme-toggle';


function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const { user, loading, logout } = useAuth();
  
  const publicRoutes = ['/', '/login'];
  const isPublicRoute = publicRoutes.includes(pathname);

  if (loading) {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <Loader2 className="h-10 w-10 animate-spin" />
        </div>
    )
  }
  
  if (isPublicRoute || !user) {
    return <>{children}</>;
  }

  return (
    <SidebarProvider>
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-[9999] focus:p-4 focus:bg-background focus:text-foreground focus:ring-2 focus:ring-ring focus:ring-offset-2">
        Skip to main content
      </a>
      <Sidebar>
        <SidebarHeader className="border-b border-sidebar-border">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 font-semibold text-foreground group-data-[state=expanded]:opacity-100 group-data-[state=collapsed]:opacity-0 transition-opacity duration-200"
            aria-label="AI-Mind Home"
          >
            <BrainCircuit className="h-6 w-6 text-primary" />
            <span className="text-lg">AI-Mind</span>
          </Link>
           <BrainCircuit className="h-7 w-7 text-primary group-data-[state=collapsed]:opacity-100 group-data-[state=expanded]:opacity-0 transition-opacity duration-200 absolute left-3 top-3" />
        </SidebarHeader>
        <SidebarContent>
          <MainNav />
        </SidebarContent>
        <SidebarFooter className="p-3">
          <Button variant="ghost" className="w-full justify-start">
            <LifeBuoy />
            <span>Help & Support</span>
          </Button>
           <Button variant="ghost" className="w-full justify-start" onClick={() => logout()}>
            <LogOut />
            <span>Log Out</span>
          </Button>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur-sm sm:px-6">
          <SidebarTrigger className="md:hidden" />
          <div className="flex-1" />
          <Button asChild>
            <Link href="/patients/new">
                <UserPlus className="mr-2 h-4 w-4" />
                Add New Patient
            </Link>
          </Button>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <UserNav />
          </div>
        </header>
        <main id="main-content" className="flex-1 p-4 md:p-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}


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
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <AppLayout>{children}</AppLayout>
          </AuthProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
