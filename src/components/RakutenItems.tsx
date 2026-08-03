import products from "@/data/rakuten-products.json";

interface Product {
  name: string;
  price: number;
  url: string;
  shop: string;
  reviews: number;
  rating: number;
  image: string;
}

/**
 * 楽天アフィリエイトの商品ブロック。
 *
 * データは build 時に楽天APIから取得した src/data/rakuten-products.json。
 * 該当キーが空なら何も描画しない（枠だけ残さない）。
 * ステマ規制対応: ブロック先頭に「広告」を明示し、rel=sponsored を付ける。
 */
export function RakutenItems({
  group,
  heading,
  note,
}: {
  group: string;
  heading: string;
  note?: string;
}) {
  const items = ((products as Record<string, Product[]>)[group] ?? []).slice(0, 2);
  if (items.length === 0) return null;

  return (
    <section className="mt-10 border border-line bg-paper-raised px-5 py-6">
      <p className="label">広告（楽天アフィリエイト）</p>
      <h2 className="display mt-2 text-lg">{heading}</h2>
      {note && <p className="mt-2 text-xs leading-6 text-ink-soft">{note}</p>}
      <ul className="mt-4 space-y-4">
        {items.map((p) => (
          <li key={p.url} className="flex gap-4">
            {p.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={p.image}
                alt=""
                width={72}
                height={72}
                loading="lazy"
                className="shrink-0 border border-line object-contain"
              />
            )}
            <div className="min-w-0 text-sm leading-6">
              <a
                href={p.url}
                target="_blank"
                rel="nofollow sponsored noopener"
                className="font-bold underline underline-offset-2"
              >
                {p.name}
              </a>
              <p className="mt-0.5 text-xs text-ink-faint">
                {p.price.toLocaleString("ja-JP")}円（{p.shop}）・レビュー
                {p.reviews.toLocaleString("ja-JP")}件 ★{p.rating}
              </p>
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-[11px] leading-5 text-ink-faint">
        価格・レビュー数は取得時点のものです。運営者はこれらの商品を購入・使用しておらず、
        販売ページの情報にもとづいて掲載しています。
      </p>
    </section>
  );
}
