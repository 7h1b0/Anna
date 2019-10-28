export const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp);

  const day = date.toDateString().replace(/\d{4}/, '');
  const hours = `${date.getHours()}`.padStart(2, '0');
  const minutes = `${date.getMinutes()}`.padStart(2, '0');

  return `${day} at ${hours}:${minutes}`;
};
