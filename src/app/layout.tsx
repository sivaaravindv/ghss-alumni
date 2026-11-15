import type { Metadata, Viewport } from 'next';
import { LangProvider } from '@/components/LangProvider';
import './globals.css';

export const metadata: Metadata = {
  title: 'GHSS Vellalankulam Alumni | அரசு மேல்நிலைப் பள்ளி, வெள்ளாளங்குளம்',
  description: 'அரசு மேல்நிலைப் பள்ளி, வெள்ளாளங்குளம் – முன்னாள் மாணவர் வலையமைப்பு'
};

export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: '#1a73e8' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ta">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Tamil:wght@400;600;700&family=Inter:wght@400;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="ta">
        <LangProvider>
          <div className="wrap">{children}</div>
        </LangProvider>
      </body>
    </html>
  );
}
