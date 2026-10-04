export function formatDiopter(value: number): string {
  const rounded = Math.round(value * 100) / 100;
  if (rounded === 0) return "0.00";
  const sign = rounded > 0 ? "+" : "-";
  return `${sign}${Math.abs(rounded).toFixed(2)}`;
}

// -10.00 .. +6.00 in 0.25 steps, the common commercial range for disposable
// contact lenses. Iterated in quarter-steps (integers) to avoid float drift.
export const DIOPTER_OPTIONS: string[] = Array.from({ length: 65 }, (_, i) => formatDiopter((i - 40) * 0.25));
