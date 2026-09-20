import type { Metadata, Viewport } from 'next';
import './compiled.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: 'CampusHustle | High-Performance Campus Gigs and HELB Runway Engine',
  description: 'Kenyan University Hustle Platform. Find verified campus escrow tasks, high-paying remote AI annotations ($14–$20/hr), HELB runway manager and M-Pesa micro-paywall.',
  keywords: ['Campus Gigs Kenya', 'HELB Runway', 'M-Pesa Escrow', 'Daraja STK Push', 'Alignerr Kenya', 'MMU', 'UoN', 'JKUAT', 'KU'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="stylesheet" href="/compiled.css" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased bg-dark-950 text-slate-100 min-h-screen selection:bg-safari-500 selection:text-white font-sans">
        {children}
      </body>
    </html>
  );
}
