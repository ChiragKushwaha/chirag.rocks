import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import {
  description as packageDescription,
  name as packageName
} from '../../../package.json';
import './globals.css';
import '../../../packages/ui/dist/index.css';
const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
});

export const metadata: Metadata = {
  title: packageName,
  description: packageDescription
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
