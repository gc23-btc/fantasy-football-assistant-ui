import '../styles/globals.css';
import { ReactNode } from 'react';
import { ErrorBoundary } from '@/components/ErrorBoundary';

export const metadata = {
  title: 'Fantasy Football Assistant',
  description: 'AI-powered fantasy football dashboard',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-950 text-gray-100">
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  );
}
