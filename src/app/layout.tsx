import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Edutic - TOEIC Learning Platform',
  description: 'Learn TOEIC effectively with AI-powered features',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
