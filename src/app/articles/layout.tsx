import Link from "next/link";

export default function ArticlesLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-5 py-12 sm:py-16">
      <article className="space-y-4 text-[0.8125rem] leading-7 text-ink-soft [&_a]:text-shu [&_a]:underline [&_a]:underline-offset-2 [&_h1]:display [&_h1]:text-[clamp(1.65rem,5vw,2.4rem)] [&_h1]:text-ink [&_h2]:display [&_h2]:mt-12 [&_h2]:text-xl [&_h2]:text-ink [&_li]:ml-5 [&_li]:list-disc [&_strong]:font-bold [&_strong]:text-ink [&_ul]:space-y-1.5">
        {children}
      </article>
      <p className="mt-12 border-t border-line pt-5 text-sm">
        <Link href="/" className="text-shu underline underline-offset-2">月別の吉日カレンダーを見る</Link>
      </p>
    </main>
  );
}
