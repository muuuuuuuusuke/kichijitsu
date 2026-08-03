import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "プライバシーポリシー",
  description: "当サイトにおけるアクセス解析・広告の取り扱いについて。",
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto w-full max-w-2xl space-y-4 px-5 py-12 text-[0.8125rem] leading-7 text-ink-soft sm:py-16">
      <h1 className="display text-[clamp(1.65rem,5vw,2.4rem)] text-ink">プライバシーポリシー</h1>
      <h2 className="display !mt-12 text-xl text-ink">アクセス解析</h2>
      <p>
        利用状況を把握するためにアクセス解析ツールを使用する場合があります。
        収集されるのは閲覧ページや参照元などの情報で、個人を特定するものではありません。
      </p>
      <h2 className="display !mt-12 text-xl text-ink">広告について</h2>
      <p>
        第三者配信の広告サービスおよびアフィリエイトプログラムを利用する場合があります。
        掲載する場合はその旨を明示します。広告配信事業者は Cookie を使用することがあり、
        ブラウザの設定で無効にできます。
      </p>
      <h2 className="display !mt-12 text-xl text-ink">免責事項</h2>
      <p>
        暦注の吉凶は慣習であり、当サイトはその効果を保証しません。
        日取りの判断による結果について責任を負いかねます。
      </p>
      <h2 className="display !mt-12 text-xl text-ink">改定</h2>
      <p>本ポリシーは、必要に応じて予告なく変更することがあります。</p>
    </main>
  );
}
