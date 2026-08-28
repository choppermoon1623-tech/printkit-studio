import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });
const siteUrl = 'https://printkit-studio.choppermoon1623.chatgpt.site';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'PrintKit Studio — 寸法からSTLをつくる',
  description: '箱やケーブルクリップなど、3Dプリンタ向けの便利ガジェットをサイズ指定で生成。',
  alternates: { canonical: siteUrl },
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    url: siteUrl,
    siteName: 'PrintKit Studio',
    title: 'PrintKit Studio — 寸法からSTLをつくる',
    description: '箱やケーブルクリップなど、3Dプリンタ向けの便利ガジェットをサイズ指定で生成。',
    images: [{ url: `${siteUrl}/og.png`, width: 1731, height: 909, alt: 'PrintKit Studioのガジェット設計イメージ' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PrintKit Studio — 寸法からSTLをつくる',
    description: '寸法を入力して、3Dプリンタ用STLをその場で生成。',
    images: [`${siteUrl}/og.png`],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ja"><body className={`${geistSans.variable} ${geistMono.variable}`}>{children}</body></html>;
}

