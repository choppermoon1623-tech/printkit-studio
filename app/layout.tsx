import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });
const siteUrl = 'https://printkit-studio.choppermoon1623.chatgpt.site';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'PrintKit Studio — A1 mini機構ジェネレーター',
  description: 'Bambu Lab A1 mini向け。フィジェット、蝶番、歯車などの一体印刷機構を寸法指定でSTL生成。',
  alternates: { canonical: siteUrl },
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    url: siteUrl,
    siteName: 'PrintKit Studio',
    title: 'PrintKit Studio — A1 mini機構ジェネレーター',
    description: 'A1 miniの180 mmプレートに合わせ、フィジェットや一体型機構をその場でSTL生成。',
    images: [{ url: `${siteUrl}/og.png`, width: 1731, height: 909, alt: 'PrintKit Studioの3Dプリント設計イメージ' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PrintKit Studio — A1 mini機構ジェネレーター',
    description: 'A1 mini向けの可動フィジェット・蝶番・歯車を寸法指定でSTL生成。',
    images: [`${siteUrl}/og.png`],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ja"><body className={`${geistSans.variable} ${geistMono.variable}`}>{children}</body></html>;
}

