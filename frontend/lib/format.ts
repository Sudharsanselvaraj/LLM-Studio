/** Compact count: 494032768 -> "494.0M", 151936 -> "151.9K", 27e9 -> "27.0B". */
export function fmtCount(n: number | null | undefined): string {
  if (n == null) return "—";
  const abs = Math.abs(n);
  if (abs >= 1e9) return (n / 1e9).toFixed(2) + "B";
  if (abs >= 1e6) return (n / 1e6).toFixed(2) + "M";
  if (abs >= 1e3) return (n / 1e3).toFixed(1) + "K";
  return String(n);
}

/** Bytes -> "12.11 GB" / "857.7 MB". */
export function fmtBytes(n: number | null | undefined): string {
  if (n == null) return "—";
  if (n >= 1024 ** 3) return (n / 1024 ** 3).toFixed(2) + " GB";
  if (n >= 1024 ** 2) return (n / 1024 ** 2).toFixed(1) + " MB";
  if (n >= 1024) return (n / 1024).toFixed(1) + " KB";
  return n + " B";
}

export const fmtShape = (shape: number[]): string =>
  shape.length ? shape.join(" × ") : "scalar";
