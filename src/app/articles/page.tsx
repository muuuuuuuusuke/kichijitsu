import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "暦注の解説",
  description: "一粒万倍日・天赦日・六曜の決まり方と慣習の解説です。",
};

const ARTICLES = [
  { slug: "ichiryu-manbaibi", title: "一粒万倍日とは", lead: "節月×十二支で機械的に決まる。していいこと・避けること。" },
  { slug: "tenshabi", title: "天赦日とは", lead: "年に5〜6日だけの最上の吉日。季節×干支の決まり方。" },
  { slug: "rokuyo", title: "六曜とは", lead: "大安・仏滅は旧暦の割り算で決まる。冠婚葬祭での実用的な扱い方。" },
];

export default function ArticlesIndex() {
  return (
    <main className="mx-auto w-full max-w-2xl px-5 py-12 sm:py-16">
      <h1 className="display text-[clamp(1.65rem,5vw,2.4rem)]">暦注の解説</h1>
      <ul className="mt-8 border-t border-line">
        {ARTICLES.map((a) => (
          <li key={a.slug} className="border-b border-line">
            <Link href={`/articles/${a.slug}`} className="block py-4 transition-colors hover:text-shu">
              <span className="display block text-lg">{a.title}</span>
              <span className="mt-1 block text-xs leading-6 text-ink-soft">{a.lead}</span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
