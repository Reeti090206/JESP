import type { Metadata } from 'next';
import './globals.css';
import { CaseProvider } from '../context/CaseContext';

export const metadata: Metadata = {
  title: 'Balance of Justice | Medical Evidence System',
  description: 'Prevent medical evidence forgery using cryptographic locking.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <CaseProvider>
          {children}
        </CaseProvider>
      </body>
    </html>
  );
}
