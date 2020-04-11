export const getPercentage = (start: number, end: number) => (
  value: number,
): number => {
  const valueInRange = Math.max(Math.min(end, value), start);
  const normalizedEnd = end - start || 1;
  const normalizedValue = valueInRange - start;

  return Math.round((normalizedValue * 100) / normalizedEnd);
};
