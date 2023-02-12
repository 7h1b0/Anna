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

export function setUser(username: string, token: string, isAway: boolean) {
  localStorage.setItem('username', username);
  localStorage.setItem('token', token);
  localStorage.setItem('isAway', isAway ? 'true' : 'false');
}

export function getToken(): string {
  return localStorage.getItem('token') ?? '';
}

export function getUser() {
  const username = localStorage.getItem('username') ?? '';
  const token = localStorage.getItem('token') ?? '';
  const isAway = localStorage.getItem('isAway') === 'true';

  return { username, token, isAway };
}

export function fetcher(url: string) {
  const token = getToken();
  return fetch(url, {
    headers: {
      'x-access-token': token,
    },
  }).then((res) => res.json());
}
