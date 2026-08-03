import koyomiJson from "@/data/koyomi.json";

export interface DayInfo {
  rokuyo: string | null;
  kanshi: string;
  eto: string;
  ichiryu: boolean;
  tensha: boolean;
  tora: boolean;
  mi: boolean;
  fujoju: boolean;
}

const data = koyomiJson as unknown as { days: Record<string, DayInfo> };

export const DAYS = data.days;
export const YEARS = [2025, 2026, 2027];

export function getDay(iso: string): DayInfo | undefined {
  return DAYS[iso];
}

export function monthDays(year: number, month: number): { iso: string; day: number; weekday: number; info: DayInfo }[] {
  const out: { iso: string; day: number; weekday: number; info: DayInfo }[] = [];
  const last = new Date(year, month, 0).getDate();
  for (let d = 1; d <= last; d += 1) {
    const iso = `${year}-${String(month).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    const info = DAYS[iso];
    if (!info) continue;
    out.push({ iso, day: d, weekday: new Date(year, month - 1, d).getDay(), info });
  }
  return out;
}

export const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"];

export function fmtJa(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const w = WEEKDAYS[new Date(y, m - 1, d).getDay()];
  return `${y}年${m}月${d}日（${w}）`;
}

export function fmtMd(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const w = WEEKDAYS[new Date(y, m - 1, d).getDay()];
  return `${m}月${d}日（${w}）`;
}

/** その日に立っている吉日ラベル。 */
export function goodLabels(info: DayInfo): string[] {
  const out: string[] = [];
  if (info.tensha) out.push("天赦日");
  if (info.ichiryu) out.push("一粒万倍日");
  if (info.rokuyo === "大安") out.push("大安");
  if (info.tora) out.push("寅の日");
  if (info.mi) out.push("巳の日");
  return out;
}

/**
 * 吉日スコア。用途ページのランキングに使う。
 * 天赦日は暦の上で最上とされるため突出させ、不成就日の重なりは減点する。
 * これは「慣習上の格付け」の実装であって、効能の主張ではない。
 */
export function score(info: DayInfo, weights: Partial<Record<"tensha" | "ichiryu" | "taian" | "tora" | "mi", number>>): number {
  let s = 0;
  if (info.tensha) s += weights.tensha ?? 0;
  if (info.ichiryu) s += weights.ichiryu ?? 0;
  if (info.rokuyo === "大安") s += weights.taian ?? 0;
  if (info.tora) s += weights.tora ?? 0;
  if (info.mi) s += weights.mi ?? 0;
  if (info.fujoju) s -= 2;
  if (info.rokuyo === "仏滅") s -= 1;
  return s;
}

export interface Purpose {
  slug: string;
  title: string;
  heading: string;
  lead: string;
  weights: Partial<Record<"tensha" | "ichiryu" | "taian" | "tora" | "mi", number>>;
  note: string;
  /** 同じ慣習の文脈でつながる外部ページ。金運の用途にだけ置く。 */
  related?: { href: string; label: string };
}

export const PURPOSES: Purpose[] = [
  {
    slug: "nyuseki",
    title: "入籍に縁起のいい日",
    heading: "入籍の日取り",
    lead: "入籍日は書類に残り、毎年思い出す日付になります。慣習では天赦日・大安・一粒万倍日が選ばれ、一粒万倍日は「二人の暮らしが万倍に実る」と読まれます。",
    weights: { tensha: 5, taian: 3, ichiryu: 2 },
    note: "仏滅・不成就日は入籍では避けられる傾向が強い日です。",
  },
  {
    slug: "kekkonshiki",
    title: "結婚式に縁起のいい日",
    heading: "結婚式の日取り",
    lead: "式場の空きと料金は六曜ではっきり動きます。大安の土日は最も早く埋まり、仏滅は割引が出ることもあります。慣習の格と実利のバランスで選んでください。",
    weights: { tensha: 5, taian: 4, ichiryu: 1 },
    note: "友引は「幸せのお裾分け」と好まれる一方、葬儀では避けられる日です。",
  },
  {
    slug: "saifu",
    title: "財布の使い始めにいい日",
    heading: "財布の使い始め",
    lead: "金運の慣習では、寅の日（金運の虎）・巳の日（弁財天の使い）・一粒万倍日が財布の新調・使い始めに選ばれます。",
    weights: { tensha: 5, ichiryu: 3, tora: 3, mi: 2 },
    note: "一粒万倍日は「借金も万倍」と読む流儀もあります。増やしたいものだけを始める日です。",
    related: {
      href: "https://takarakuji-map.vercel.app/",
      label: "宝くじを買う日に選ぶ人も多い日です。実際に高額当せんが出た売り場の記録",
    },
  },
  {
    slug: "nosha",
    title: "納車に縁起のいい日",
    heading: "納車の日取り",
    lead: "納車日はディーラーと調整できることが多く、大安が最も選ばれます。赤口は「刃物・事故」を連想させるため車では避ける流儀があります。",
    weights: { tensha: 4, taian: 4, ichiryu: 1 },
    note: "寅の日は「出て行っても戻る」と読まれ、旅立ち・車にも良いとされます。",
  },
  {
    slug: "kaigyo",
    title: "開業・開店に縁起のいい日",
    heading: "開業・開店の日取り",
    lead: "事業の始まりには、最上の吉日とされる天赦日と、始めたことが万倍に実るとされる一粒万倍日が選ばれます。登記日を合わせる人もいます。",
    weights: { tensha: 6, ichiryu: 4, taian: 2 },
    note: "不成就日は「始めたことが成就しない」と読まれ、開業では特に避けられます。",
  },
  {
    slug: "hikkoshi",
    title: "引越しに縁起のいい日",
    heading: "引越しの日取り",
    lead: "引越しは大安・友引が好まれ、料金は六曜より曜日と月で動きます。縁起と料金は別の軸で見るのが実用的です。",
    weights: { tensha: 4, taian: 3, ichiryu: 2 },
    note: "三隣亡など地域の慣習が残る土地もあります。ご実家の流儀も確認を。",
  },
];

/** 向こう N ヶ月の「良い日」ランキング。 */
export function bestDays(
  purpose: Purpose,
  fromIso: string,
  months = 12,
  limit = 20,
): { iso: string; info: DayInfo; s: number }[] {
  const from = new Date(fromIso);
  const to = new Date(from);
  to.setMonth(to.getMonth() + months);
  const rows = Object.entries(DAYS)
    .filter(([iso]) => {
      const d = new Date(iso);
      return d >= from && d < to;
    })
    .map(([iso, info]) => ({ iso, info, s: score(info, purpose.weights) }))
    .filter((r) => r.s >= 3);
  rows.sort((a, b) => b.s - a.s || a.iso.localeCompare(b.iso));
  return rows.slice(0, limit);
}
