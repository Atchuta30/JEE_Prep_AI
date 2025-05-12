import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { AppLayout } from '@/components/layout/app-layout';
import Script from 'next/script';
import { Toaster } from "@/components/ui/toaster"
import AuthProvider from '@/context/auth-provider';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'JEE Prep AI',
  description: 'Generate custom JEE Main-style multiple-choice questions and mock papers with AI to supercharge your preparation.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script id="mathjax-config">
          {`
            MathJax = {
              tex: {
                inlineMath: [['$', '$'], ['\\\\(', '\\\\)']],
                displayMath: [['$$', '$$'], ['\\\\[', '\\\\]']],
                processEscapes: true,
                tags: 'ams', // For equation numbering
              },
              svg: {
                fontCache: 'global'
              },
              chtml: {
                matchFontHeight: false // To prevent inconsistent font sizes
              },
              loader: {load: ['[tex]/ams']}, // Load ams package
              startup: {
                ready: () => {
                  MathJax.startup.defaultReady();
                  // Custom ready logic if needed
                }
              }
            };
          `}
        </Script>
        <Script
          id="MathJax-script"
          async
          src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"
        ></Script>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
          <AppLayout>{children}</AppLayout>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
