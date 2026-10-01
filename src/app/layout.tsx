import type { Metadata } from 'next';
import './globals.css';
import { AppProviders } from '@/providers/QueryProvider';

export const metadata: Metadata = {
  title: 'TELC Mastery — Admin Panel',
  description: 'Complete Learning Management & Content Administration Platform for TELC Mastery German Vocabulary Application',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 min-h-screen antialiased">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
