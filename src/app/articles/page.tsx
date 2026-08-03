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


/** 記事の図版。暦本の意匠で内容を図にする: 一粒万倍=稲穂、天赦=日輪、六曜=六分の円。 */
function Thumb({ slug }: { slug: string }) {
  const sumi = "var(--sumi)";
  const shu = "var(--shu)";
  const kin = "var(--kin)";
  return (
    <svg viewBox="0 0 160 100" className="h-[100px] w-40 shrink-0 border border-line" aria-hidden>
      <rect width="160" height="100" fill="var(--washi-raised)" />
      {slug === "ichiryu-manbaibi" && (
        <g fill="none" strokeWidth="2">
          <path d="M80 88C78 60 76 44 84 22" stroke={sumi} />
          <path d="M84 30c8-6 16-6 22-2M82 42c8-6 18-5 24 0M80 54c9-5 18-4 25 2" stroke={kin} />
          <path d="M84 30c-8-4-14-2-20 4M82 42c-9-3-16 0-21 6" stroke={kin} />
          <circle cx="108" cy="26" r="3" fill={shu} stroke="none" />
        </g>
      )}
      {slug === "tenshabi" && (
        <g fill="none" strokeWidth="2">
          <circle cx="80" cy="50" r="20" stroke={shu} strokeWidth="3" />
          <g stroke={kin} strokeWidth="1.5">
            <path d="M80 16v10M80 74v10M46 50h10M104 50h10M56 26l7 7M104 74l-7-7M104 26l-7 7M56 74l7-7" />
          </g>
        </g>
      )}
      {slug === "rokuyo" && (
        <g fill="none" strokeWidth="2">
          <circle cx="80" cy="50" r="30" stroke={sumi} />
          <g stroke={sumi} strokeWidth="1.2">
            <path d="M80 20v60M54 35l52 30M54 65l52-30" />
          </g>
          <path d="M80 50L80 20A30 30 0 0 1 106 35Z" fill={shu} fillOpacity="0.55" stroke="none" />
        </g>
      )}
    </svg>
  );
}

export default function ArticlesIndex() {
  return (
    <main className="mx-auto w-full max-w-2xl px-5 py-12 sm:py-16">
      <h1 className="display text-[clamp(1.65rem,5vw,2.4rem)]">暦注の解説</h1>
      <ul className="!ml-0 mt-8 list-none border-t border-line">
        {ARTICLES.map((a) => (
          <li key={a.slug} className="!ml-0 !list-none border-b border-line">
            <Link href={`/articles/${a.slug}`} className="!no-underline flex items-center gap-5 py-4 transition-colors hover:text-shu">
              <Thumb slug={a.slug} />
              <span>
                <span className="display block text-lg">{a.title}</span>
                <span className="mt-1 block text-xs leading-6 text-ink-soft">{a.lead}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
