export const getPercentage = (start: number, end: number) => (
  value: number,
): number => {
  const valueInRange = Math.max(Math.min(end, value), start);
  const normalizedEnd = end - start || 1;
  const normalizedValue = valueInRange - start;

  return Math.round((normalizedValue * 100) / normalizedEnd);
};

export function formatDate(timestamp: number): string {
  const date = new Date(timestamp);

  const day = date.toDateString().replace(/\d{4}/, '');
  const hours = `${date.getHours()}`.padStart(2, '0');
  const minutes = `${date.getMinutes()}`.padStart(2, '0');

  return `${day} at ${hours}:${minutes}`;
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
