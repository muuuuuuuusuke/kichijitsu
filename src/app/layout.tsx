import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

const SITE_URL = "https://kichijitsu.vercel.app";
const SITE_NAME = "吉日カレンダー";
const DESCRIPTION =
  "一粒万倍日・天赦日・大安・寅の日・巳の日を、月別カレンダーと用途別（入籍・財布・納車・開業）の一覧で。" +
  "六曜と暦注はすべて天文計算にもとづき、市販の暦と突き合わせて検証しています。";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "吉日カレンダー｜一粒万倍日・天赦日・大安がひと目でわかる",
    template: `%s｜${SITE_NAME}`,
  },
  description: DESCRIPTION,
  // Search Console の所有権確認。トークンは Google アカウント単位。
  verification: {
    google: "KPe0iMIzhr19t3Ml_nAZBxmRBeS5A_svFCPMSfH3Tv4",
  },
  // Pinterest のサイト認証。認証すると、他人がこのサイトのページを
  // ピンしたときにも運営者名とアナリティクスが紐づく。値はアカウント共通。
  other: { "p:domain_verify": "5cfd1657f375c7632807a4e178b6b032" },
  openGraph: {
    title: SITE_NAME,
    description: DESCRIPTION,
    url: "/",
    siteName: SITE_NAME,
    locale: "ja_JP",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Yuji+Syuku&family=BIZ+UDPGothic:wght@400;700&display=swap"
        />
      </head>
      <body className="flex min-h-full flex-col antialiased">
        {/* 朱印のにじみ。捺した印のエッジを歪ませる変位フィルタ */}
        <svg aria-hidden width="0" height="0" style={{ position: "absolute" }}>
          <filter id="inkbleed">
            <feTurbulence type="fractalNoise" baseFrequency="0.07" numOctaves="3" seed="4" result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale="2.6" />
          </filter>
        </svg>
        <header className="border-b border-line bg-paper-raised">
          <div className="mx-auto flex w-full max-w-3xl items-center justify-between px-5 py-3.5">
            <Link href="/" className="display text-base hover:text-shu">
              吉日カレンダー
            </Link>
            <nav className="flex gap-4 text-xs text-ink-soft">
              <Link href="/calendar/2026/1" className="hover:text-shu">月別カレンダー</Link>
              <Link href="/articles" className="hover:text-shu">暦注の解説</Link>
            </nav>
          </div>
        </header>

        <div className="flex-1">{children}</div>

        <footer className="mt-16 border-t border-line">
          <div className="mx-auto w-full max-w-3xl px-5 py-8 text-xs leading-6 text-ink-faint">
            <p>
              六曜・暦注は天文計算（朔と二十四節気）から算出し、公表されている暦と
              突き合わせて検証しています。吉凶は古くからの慣習であり、
              科学的な根拠を主張するものではありません。
            </p>
            <p className="mt-3">
              <Link href="/articles" className="hover:text-ink">暦注の解説</Link>
              <span className="mx-2">|</span>
              <Link href="/about" className="hover:text-ink">このサイトについて</Link>
              <span className="mx-2">|</span>
              <Link href="/privacy" className="hover:text-ink">プライバシーポリシー</Link>
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
