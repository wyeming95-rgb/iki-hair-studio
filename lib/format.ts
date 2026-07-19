/** Formats whole minutes as "30 min", "1 hr", "2 hr 30 min". */
export function formatDuration(minutes: number): string {
  if (minutes <= 0) return '—';
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hrs === 0) return `${mins} min`;
  if (mins === 0) return `${hrs} hr`;
  return `${hrs} hr ${mins} min`;
}

/** Formats a ringgit amount as "RM 1,250". No decimals — these are estimates. */
export function formatPrice(rm: number): string {
  return `RM ${rm.toLocaleString('en-MY')}`;
}
