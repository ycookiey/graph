export function toISODate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function isoDateDaysAgo(days: number): string {
  const start = new Date();
  start.setDate(start.getDate() - days);
  return toISODate(start);
}

