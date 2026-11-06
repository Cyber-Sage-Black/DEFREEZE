import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://defreeze.vercel.app'),
  title: 'DEFREEZE | Break Free. Become.',
  description:
    'An exclusive physical game experience this November. 25 spots. One experience. A step towards becoming. Come as you are, leave a little lighter.',
  keywords: [
    'DEFREEZE',
    'Personal Growth',
    'Physical Game Experience',
    'Lagos Event',
    'Break Free Become',
    'Youth Empowerment',
    'Mindset',
  ],
  openGraph: {
    title: 'DEFREEZE | Break Free. Become.',
    description:
      'An exclusive physical game experience this November. 25 spots. One experience. A step towards becoming.',
    images: [
      {
        url: '/images/defreeze-flyer-ice.jpg',
        width: 1200,
        height: 630,
        alt: 'DEFREEZE - It is okay to thaw',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col bg-[#050713] text-slate-100">{children}</body>
    </html>
  );
}
