import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'EcoFarm - AI Agricultural Advisory',
  description: 'Smart farming with AI-powered crop advisory and pest detection',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
