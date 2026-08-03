import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "このサイトについて",
  description: "六曜・暦注の算出方法、検証の方法、運営者についての情報です。",
};

export default function AboutPage() {
  return (
    <main className="mx-auto w-full max-w-2xl space-y-4 px-5 py-12 text-[0.8125rem] leading-7 text-ink-soft sm:py-16">
      <h1 className="display text-[clamp(1.65rem,5vw,2.4rem)] text-ink">このサイトについて</h1>

      <h2 className="display !mt-12 text-xl text-ink">何をするサイトか</h2>
      <p>
        一粒万倍日・天赦日・六曜・寅の日・巳の日・不成就日を、
        月別カレンダーと用途別の一覧で引けるようにしています。
        2025年から2027年までを収録しています。
      </p>

      <h2 className="display !mt-12 text-xl text-ink">日付の算出方法</h2>
      <ul className="space-y-1.5">
        <li className="ml-5 list-disc">
          朔（新月）と太陽黄経（二十四節気）を天文計算で求め、そこから
          旧暦（天保暦の規則）・日の干支・節月を組み立てています
        </li>
        <li className="ml-5 list-disc">六曜＝旧暦の月と日の和を6で割った余り</li>
        <li className="ml-5 list-disc">一粒万倍日＝節月ごとの十二支の対応、天赦日＝季節×干支の対応</li>
        <li className="ml-5 list-disc">
          算出結果は、公表されている暦（2026年の天赦日全6日、一粒万倍日、
          旧正月の日付など）と突き合わせ、一致を確認してから掲載しています
        </li>
      </ul>

      <h2 className="display !mt-12 text-xl text-ink">吉凶の扱い</h2>
      <p>
        <strong className="font-bold text-ink">日付は計算で決まる事実、吉凶は慣習です。</strong>
        当サイトは吉凶の効果を主張しません。用途別ページの並び順は、
        慣習上の格付け（天赦日を最上とするなど）を整理したものです。
      </p>

      <h2 className="display !mt-12 text-xl text-ink">運営者</h2>
      <p>しがないランナー（個人運営・東京都）</p>
      <p className="text-xs text-ink-faint">個人運営のため詳細な住所は非公開としています。</p>

      <h2 className="display !mt-12 text-xl text-ink">広告について</h2>
      <p>
        当サイトはアフィリエイトプログラムによる広告を掲載する場合があります。
        その場合は広告である旨をリンクの近くに明示します。
      </p>

      {/* 同一運営者の開示。評価目的の相互リンクではないため、このページに限定する。 */}
      <h2 className="display !mt-12 text-xl text-ink">同じ運営者のサイト</h2>
      <ul className="space-y-1.5">
        <li className="ml-5 list-disc">
          <a href="https://circle-map.com" className="text-shu underline underline-offset-2">circle-map</a>
          ：地図上に同心円を描き、商圏や通勤圏の距離を確認できるツール
        </li>
        <li className="ml-5 list-disc">
          <a href="https://setsuritsu-cost.vercel.app" className="text-shu underline underline-offset-2">会社設立の費用計算</a>
          ：資本金と会社形態から法定費用を計算するツール
        </li>
        <li className="ml-5 list-disc">
          <a href="https://sogyo-yushi.vercel.app" className="text-shu underline underline-offset-2">創業融資の返済シミュレーター</a>
          ：借入額と金利から毎月の返済額を計算するツール
        </li>
        <li className="ml-5 list-disc">
          <a href="https://kyuyo-rank.vercel.app" className="text-shu underline underline-offset-2">医療・介護の給与相場ランキング</a>
          ：看護師・保育士・介護職などの給与相場を公的統計から見られるツール
        </li>
        <li className="ml-5 list-disc">
          <a href="https://tech-kyuyo.vercel.app" className="text-shu underline underline-offset-2">技術職の給与相場ランキング</a>
          ：エンジニア・技術職の給与相場を公的統計から見られるツール
        </li>
        <li className="ml-5 list-disc">
          <a href="https://jikka-chika.vercel.app" className="text-shu underline underline-offset-2">実家の地価</a>
          ：全国の住宅地の地価と30年の推移を市区町村別に見られるツール
        </li>
        <li className="ml-5 list-disc">
          <a href="https://animal-videos-six.vercel.app" className="text-shu underline underline-offset-2">どうぶつじゅかん</a>
          ：世界中の動物の動画を、種類別に集めた図鑑サイト
        </li>
      </ul>
    </main>
  );
}
