'use client';
import AppShellWrapper from '@/components/Appshell';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <AppShellWrapper> {children}</AppShellWrapper>;
}
