/**
 * 朱印。色としての赤ではなく「捺したもの」として使う。
 * にじみは globals.css の .stamp（#inkbleed フィルタ）が付ける。
 * サイズは文字数で決め打ち: 1文字=正方形、2文字=縦長。
 */
export function Stamp({
  children,
  size = "md",
  animate = false,
}: {
  children: string;
  size?: "sm" | "md" | "lg";
  animate?: boolean;
}) {
  const tall = children.length > 1;
  const dims = {
    sm: tall ? "h-14 w-9 text-lg" : "h-9 w-9 text-lg",
    md: tall ? "h-20 w-12 text-3xl" : "h-14 w-14 text-3xl",
    lg: tall ? "h-36 w-20 text-5xl" : "h-24 w-24 text-6xl",
  }[size];
  return (
    <span
      aria-hidden
      className={`stamp ${animate ? "stamp-in" : "-rotate-6"} inline-flex shrink-0 select-none items-center justify-center ${dims}`}
      style={{
        writingMode: tall ? "vertical-rl" : undefined,
        lineHeight: 1,
        letterSpacing: tall ? "0.1em" : undefined,
      }}
    >
      {children}
    </span>
  );
}
