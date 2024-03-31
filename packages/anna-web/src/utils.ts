export const getPercentage =
  (start: number, end: number) =>
  (value: number): number => {
    const valueInRange = Math.max(Math.min(end, value), start);
    const normalizedEnd = end - start || 1;
    const normalizedValue = valueInRange - start;

    return Math.round((normalizedValue * 100) / normalizedEnd);
  };

export function formatDate(timestamp: number): string {
  const date = new Date(timestamp);

  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function groupBy<T>(array: T[], predicate: (el: T) => boolean): T[][] {
  return array.reduce(
    (acc: T[][], el) => {
      if (predicate(el)) {
        acc[0].push(el);
      } else {
        acc[1].push(el);
      }
      return acc;
    },
    [[], []],
  );
}

export function fetcher(url: string) {
  return fetch(url).then((res) => res.json());
}
