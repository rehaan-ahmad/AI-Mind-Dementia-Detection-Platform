
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Shield, Bot, Settings, Users } from 'lucide-react';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { useAuth } from '@/app/auth/auth-provider';

export function MainNav() {
  const pathname = usePathname();
  const { user } = useAuth();

  const mainNavItems = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', tooltip: 'Dashboard' },
    { href: '/assessment', icon: Bot, label: 'AI Assessment', tooltip: 'AI Assessment' },
    { href: '/dashboard', icon: Users, label: 'All Patients', tooltip: 'All Patients' },
  ];

  const secondaryNavItems = [
    { href: '/settings', icon: Settings, label: 'Settings', tooltip: 'Settings' },
  ];

  const adminNavItems = [
    { href: '/admin', icon: Shield, label: 'Admin Panel', tooltip: 'Admin Panel', role: 'admin' },
  ];

  return (
    <div className="flex flex-col h-full">
      <SidebarMenu className="flex-1">
        {mainNavItems.map(item => (
          <SidebarMenuItem key={item.href + item.label}>
            <Link href={item.href}>
              <SidebarMenuButton 
                isActive={pathname.startsWith(item.href) && (item.href !== '/dashboard' || pathname === '/dashboard' || (item.label === 'All Patients' && pathname.startsWith('/dashboard')))} 
                tooltip={item.tooltip}
              >
                <item.icon />
                <span>{item.label}</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
      
      <div className="mt-auto">
        <SidebarSeparator />
        <SidebarMenu>
          {secondaryNavItems.map(item => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href}>
                <SidebarMenuButton isActive={pathname.startsWith(item.href)} tooltip={item.tooltip}>
                  <item.icon />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
          {user?.role === 'admin' && adminNavItems.map(item => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href}>
                <SidebarMenuButton isActive={pathname.startsWith(item.href)} tooltip={item.tooltip}>
                  <item.icon />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </div>
    </div>
  );
}
