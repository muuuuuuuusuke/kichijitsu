import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { WEEKDAYS, YEARS, fmtMd, goodLabels, monthDays } from "@/lib/koyomi";

export function generateStaticParams() {
  return YEARS.flatMap((y) =>
    Array.from({ length: 12 }, (_, i) => ({ year: String(y), month: String(i + 1) })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ year: string; month: string }>;
}): Promise<Metadata> {
  const { year, month } = await params;
  const days = monthDays(Number(year), Number(month));
  if (days.length === 0) return {};
  const ichiryu = days.filter((d) => d.info.ichiryu).map((d) => `${Number(month)}月${d.day}日`);
  return {
    title: {
      absolute: `${year}年${month}月の吉日カレンダー｜一粒万倍日・天赦日・大安`,
    },
    description:
      `${year}年${month}月の一粒万倍日は${ichiryu.join("・") || "なし"}。` +
      `天赦日・大安・寅の日・巳の日・不成就日まで、六曜つきの暦カレンダーで確認できます。`,
  };
}

export default async function MonthPage({
  params,
}: {
  params: Promise<{ year: string; month: string }>;
}) {
  const { year: ys, month: ms } = await params;
  const year = Number(ys);
  const month = Number(ms);
  if (!YEARS.includes(year) || month < 1 || month > 12) notFound();
  const days = monthDays(year, month);
  if (days.length === 0) notFound();

  const prev = month === 1 ? { y: year - 1, m: 12 } : { y: year, m: month - 1 };
  const next = month === 12 ? { y: year + 1, m: 1 } : { y: year, m: month + 1 };

  return (
    <main className="mx-auto w-full max-w-3xl px-5 py-10 sm:py-14">
      <nav className="flex items-baseline justify-between text-sm">
        {YEARS.includes(prev.y) ? (
          <Link href={`/calendar/${prev.y}/${prev.m}`} className="text-ink-soft hover:text-shu">
            ← {prev.m}月
          </Link>
        ) : <span />}
        {YEARS.includes(next.y) ? (
          <Link href={`/calendar/${next.y}/${next.m}`} className="text-ink-soft hover:text-shu">
            {next.m}月 →
          </Link>
        ) : <span />}
      </nav>

      <h1 className="display mt-3 text-[clamp(1.75rem,5.5vw,2.6rem)]">
        {year}年{month}月の吉日カレンダー
      </h1>
      <p className="mt-4 text-[0.8125rem] leading-7 text-ink-soft">
        朱の帯が吉日、灰の帯が不成就日です。同じ日に吉凶が重なることもあります
        （慣習では、不成就日の重なりは吉を弱めると読まれます）。
      </p>

      <ul className="mt-8 border-t border-line">
        {days.map(({ iso, day, weekday, info }) => {
          const labels = goodLabels(info);
          return (
            <li
              key={iso}
              className={`flex items-baseline gap-3 border-b border-line py-2 ${
                labels.length > 0 ? "bg-paper-raised" : ""
              }`}
            >
              <span
                className={`figure w-9 shrink-0 text-right text-sm ${
                  weekday === 0 ? "text-shu" : weekday === 6 ? "text-gold" : ""
                }`}
              >
                {day}
              </span>
              <span className={`w-6 shrink-0 text-xs ${weekday === 0 ? "text-shu" : weekday === 6 ? "text-gold" : "text-ink-faint"}`}>
                {WEEKDAYS[weekday]}
              </span>
              <span className="w-10 shrink-0 text-xs text-ink-soft">{info.rokuyo}</span>
              <span className="flex flex-1 flex-wrap gap-1.5">
                {labels.map((l) => (
                  <span
                    key={l}
                    className={`rounded-sm px-1.5 py-0.5 text-[11px] font-bold ${
                      l === "天赦日" ? "bg-shu text-white" : "bg-shu-soft text-shu"
                    }`}
                  >
                    {l}
                  </span>
                ))}
                {info.fujoju && (
                  <span className="rounded-sm bg-line px-1.5 py-0.5 text-[11px] text-ink-soft">
                    不成就日
                  </span>
                )}
              </span>
              <span className="hidden text-[11px] text-ink-faint sm:block">{info.kanshi}</span>
            </li>
          );
        })}
      </ul>

      <section className="mt-10 text-sm">
        <p className="label mb-3">この月の要点</p>
        <ul className="space-y-1.5 text-[0.8125rem] leading-6 text-ink-soft">
          <li className="ml-5 list-disc">
            一粒万倍日：{days.filter((d) => d.info.ichiryu).map((d) => fmtMd(d.iso)).join("、") || "なし"}
          </li>
          <li className="ml-5 list-disc">
            天赦日：{days.filter((d) => d.info.tensha).map((d) => fmtMd(d.iso)).join("、") || "なし"}
          </li>
          <li className="ml-5 list-disc">
            大安：{days.filter((d) => d.info.rokuyo === "大安").map((d) => `${d.day}日`).join("、")}
          </li>
        </ul>
      </section>
    </main>
  );
}
