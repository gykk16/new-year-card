import type {Metadata} from 'next';
import type {ReactNode} from 'react';
import {Space_Grotesk, Noto_Sans_KR} from 'next/font/google';
import './globals.css';

/** Space Grotesk font for numbers and English text */
const spaceGrotesk = Space_Grotesk({
  variable: '--font-space',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

/** Noto Sans KR font for Korean text */
const notoSansKr = Noto_Sans_KR({
  variable: '--font-noto',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

/** Site URL for metadata */
const SITE_URL = 'https://new-year-2026.vercel.app';

/** Page metadata */
export const metadata: Metadata = {
  title: '2026 새해 복 많이 받으세요 🎉',
  description: '새해복 많이 받으세요! by 글로리',
  keywords: ['새해', '2026', '카운트다운', '행운', 'New Year'],
  authors: [{name: 'gykk16'}],
  openGraph: {
    title: '2026 새해 복 많이 받으세요 🎉',
    description: '새해복 많이 받으세요! by 글로리',
    url: SITE_URL,
    siteName: 'New Year 2026',
    images: [
      {
        url: `${SITE_URL}/new-year.webp`,
        width: 400,
        height: 560,
        alt: '2026 새해 카드',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '2026 새해 복 많이 받으세요 🎉',
    description: '새해복 많이 받으세요! by 글로리',
    images: [`${SITE_URL}/new-year.webp`],
  },
};

/** Root layout props */
interface RootLayoutProps {
  children: ReactNode;
}

/**
 * Root layout component with font configuration
 */
export default function RootLayout({children}: Readonly<RootLayoutProps>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body
        className={`${spaceGrotesk.variable} ${notoSansKr.variable} font-sans antialiased`}
        style={{fontFamily: 'var(--font-noto), var(--font-space), sans-serif'}}
      >
        {children}
      </body>
    </html>
  );
}
