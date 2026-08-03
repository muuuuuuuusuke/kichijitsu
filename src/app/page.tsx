import Link from "next/link";
import { DAYS, PURPOSES, fmtJa, goodLabels } from "@/lib/koyomi";

/** 天赦日と、天赦日×一粒万倍日の重なりを年ごとに拾う。 */
function tenshaOf(year: number) {
  return Object.entries(DAYS)
    .filter(([iso, v]) => iso.startsWith(String(year)) && v.tensha)
    .map(([iso, v]) => ({ iso, v }));
}

export default function Home() {
  const years = [2026, 2027];

  return (
    <main className="mx-auto w-full max-w-3xl px-5 py-10 sm:py-14">
      <p className="label">六曜・暦注カレンダー（2025〜2027）</p>
      <h1 className="display mt-3 text-[clamp(1.9rem,6vw,3rem)]">
        いい日を選んで、
        <br />
        始めるためのカレンダー
      </h1>
      <p className="mt-5 max-w-xl text-[0.8125rem] leading-7 text-ink-soft">
        一粒万倍日・天赦日・大安・寅の日・巳の日を、月別と用途別で引けます。
        日付はすべて天文計算（朔と二十四節気）から求め、
        公表されている暦と突き合わせて検証したものです。
      </p>

      <section className="mt-10">
        <h2 className="display text-xl">用途から探す</h2>
        <div className="mt-4 grid grid-cols-1 gap-px border border-line bg-line sm:grid-cols-2">
          {PURPOSES.map((p) => (
            <Link
              key={p.slug}
              href={`/${p.slug}`}
              className="bg-paper-raised px-4 py-3.5 text-sm transition-colors hover:text-shu"
            >
              {p.title}
            </Link>
          ))}
        </div>
      </section>

      {years.map((year) => {
        const tensha = tenshaOf(year);
        return (
          <section key={year} className="mt-12">
            <h2 className="display text-xl">{year}年の天赦日（{tensha.length}日）</h2>
            <p className="mt-2 text-xs leading-6 text-ink-soft">
              天赦日は「天がすべてを赦す」と読まれる、暦の上で最上の吉日です。年に5〜6日しかありません。
            </p>
            <ul className="mt-4 border-t border-line">
              {tensha.map(({ iso, v }) => (
                <li key={iso} className="flex items-baseline gap-3 border-b border-line py-2.5">
                  <span className="figure text-sm">{fmtJa(iso)}</span>
                  <span className="flex flex-wrap gap-1.5">
                    {goodLabels(v).map((l) => (
                      <span
                        key={l}
                        className={`rounded-sm px-1.5 py-0.5 text-[11px] font-bold ${
                          l === "天赦日" ? "bg-shu text-white" : "bg-shu-soft text-shu"
                        }`}
                      >
                        {l}
                      </span>
                    ))}
                    {v.fujoju && (
                      <span className="rounded-sm bg-line px-1.5 py-0.5 text-[11px] text-ink-soft">
                        不成就日と重なる
                      </span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        );
      })}

      <section className="mt-12">
        <h2 className="display text-xl">月別カレンダー</h2>
        <div className="mt-4 space-y-3">
          {[2025, 2026, 2027].map((year) => (
            <div key={year} className="flex flex-wrap items-baseline gap-x-3 gap-y-1.5">
              <span className="label">{year}年</span>
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                <Link
                  key={m}
                  href={`/calendar/${year}/${m}`}
                  className="text-sm text-ink-soft underline-offset-2 hover:text-shu hover:underline"
                >
                  {m}月
                </Link>
              ))}
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12 text-xs leading-6 text-ink-faint">
        <p className="label mb-3">この暦について</p>
        <p>
          六曜は旧暦（朔で始まる月）から、一粒万倍日・天赦日は二十四節気と日の干支から
          機械的に決まります。当サイトは天文計算でこれらを算出し、
          公表されている暦（2026年の天赦日全6日・一粒万倍日ほか）との一致を確認しています。
          吉凶そのものは慣習であり、効果を保証するものではありません。
        </p>
      </section>
    </main>
  );
}
