import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PURPOSES, bestDays, fmtJa, goodLabels } from "@/lib/koyomi";
import { RakutenItems } from "@/components/RakutenItems";

// 静的サイトなので「向こう12ヶ月」の起点はビルド時点。データは2027年末まである。
const FROM = "2026-08-01";

export function generateStaticParams() {
  return PURPOSES.map((p) => ({ purpose: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ purpose: string }>;
}): Promise<Metadata> {
  const { purpose } = await params;
  const p = PURPOSES.find((x) => x.slug === purpose);
  if (!p) return {};
  const top = bestDays(p, FROM, 12, 3).map((r) => fmtJa(r.iso));
  return {
    title: { absolute: `${p.title}【2026-2027】カレンダーと選び方` },
    description: `${p.lead} 直近の候補は${top.join("、")}など。天文計算にもとづく暦データから、良い日を順に一覧できます。`,
  };
}

export default async function PurposePage({
  params,
}: {
  params: Promise<{ purpose: string }>;
}) {
  const { purpose } = await params;
  const p = PURPOSES.find((x) => x.slug === purpose);
  if (!p) notFound();
  const rows = bestDays(p, FROM, 12, 20);

  return (
    <main className="mx-auto w-full max-w-3xl px-5 py-10 sm:py-14">
      <nav className="text-xs text-ink-faint">
        <Link href="/" className="hover:text-ink">吉日カレンダー</Link>
        <span className="mx-1.5">/</span>
        {p.heading}
      </nav>

      <h1 className="display mt-3 text-[clamp(1.75rem,5.5vw,2.6rem)]">{p.title}</h1>
      <p className="mt-4 max-w-xl text-[0.8125rem] leading-7 text-ink-soft">{p.lead}</p>

      <section className="mt-9">
        <div className="rule-double flex items-baseline justify-between pt-2 pb-2">
          <h2 className="display text-lg">良い日順（2026年8月〜2027年7月）</h2>
        </div>
        <ol className="divide-y divide-line">
          {rows.map(({ iso, info }, i) => (
            <li key={iso} className="flex items-baseline gap-3 py-2.5">
              <span className="w-6 shrink-0 text-xs tabular-nums text-ink-faint">{i + 1}</span>
              <span className="figure text-sm">{fmtJa(iso)}</span>
              <span className="flex flex-1 flex-wrap gap-1.5">
                {goodLabels(info).map((l) => (
                  <span
                    key={l}
                    className={`px-1.5 py-0.5 text-[11px] font-bold ${
                      l === "天赦日" ? "stamp !border-2 px-2" : "bg-shu-soft text-shu"
                    }`}
                  >
                    {l}
                  </span>
                ))}
                {info.fujoju && (
                  <span className="rounded-sm bg-line px-1.5 py-0.5 text-[11px] text-ink-soft">
                    不成就日と重なる
                  </span>
                )}
              </span>
            </li>
          ))}
        </ol>
        <p className="mt-4 text-xs leading-6 text-ink-faint">{p.note}</p>
      </section>

      {p.slug === "saifu" && (
        <>
          {/* 財布ページだけの商品ブロック。日取り(寅の日)と買う物(財布)が同じ文脈にある唯一のページ。 */}
          <RakutenItems
            group="saifu_mens"
            heading="使い始めの日に合わせて新調する（メンズ長財布）"
            note="レビュー件数の多い順に取得した本革長財布です。吉日に使い始める前提なら、届くまでの日数も見て選んでください。"
          />
          <RakutenItems
            group="saifu_ladies"
            heading="使い始めの日に合わせて新調する（レディース長財布）"
          />
        </>
      )}

      <section className="mt-12">
        <p className="label">ほかの用途</p>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm">
          {PURPOSES.filter((x) => x.slug !== p.slug).map((x) => (
            <Link key={x.slug} href={`/${x.slug}`} className="text-ink-soft underline-offset-2 hover:text-shu hover:underline">
              {x.title}
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-12 text-xs leading-6 text-ink-faint">
        <p>
          並び順は、天赦日・一粒万倍日・六曜などの慣習上の格付けを用途別に重み付けしたものです。
          吉凶は古くからの慣習であり、効果を保証するものではありません。
          日付の算出方法は<Link href="/about" className="underline hover:text-ink">このサイトについて</Link>をご覧ください。
        </p>
      </section>
    </main>
  );
}
