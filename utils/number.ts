import BN from "bn.js";
export function formatUnits(input: number | string, decimals: number): number {
  const bn = new BN(input);
  return bn.toNumber() / Math.pow(10, decimals);
}

export function parseUnits(num: number | string, decimals: number): number {
  const mul = Math.pow(10, decimals);
  return new BN(num * mul).toNumber();
}

export function formatNumber(num: number): string {
  if (num < 1e3) return num.toString();
  if (num >= 1e3 && num < 1e6) return +(num / 1e3).toFixed(1) + "K";
  if (num >= 1e6 && num < 1e9) return +(num / 1e6).toFixed(1) + "M";
  if (num >= 1e9 && num < 1e12) return +(num / 1e9).toFixed(1) + "B";
  if (num >= 1e12) return +(num / 1e12).toFixed(1) + "T";
  return num.toString();
}
