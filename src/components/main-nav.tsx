'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Shield } from 'lucide-react';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { useAuth } from '@/app/auth/auth-provider';

export function MainNav() {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Link href="/">
          <SidebarMenuButton isActive={pathname === '/'} tooltip="Dashboard">
            <LayoutDashboard />
            <span>Dashboard</span>
          </SidebarMenuButton>
        </Link>
      </SidebarMenuItem>
      {user?.role === 'admin' && (
        <SidebarMenuItem>
          <Link href="/admin">
            <SidebarMenuButton isActive={pathname === '/admin'} tooltip="Admin Panel">
              <Shield />
              <span>Admin Panel</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      )}
    </SidebarMenu>
  );
}
