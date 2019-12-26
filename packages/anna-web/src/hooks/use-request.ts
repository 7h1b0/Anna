import { useUser } from 'context/user-context';

export default function useRequest<T>(): (
  path: string,
  method: 'GET' | 'POST' | 'DELETE' | 'PATCH',
  body?: Object,
) => Promise<T> {
  const user = useUser();

  return async (path, method, body): Promise<T> => {
    const headers: Record<string, string> = {
      'x-access-token': user && user.token ? user.token : '',
    };
    if (['POST', 'PATCH'].includes(method)) {
      headers['Content-Type'] = 'application/json';
    }

    const res = await fetch(
      path,
      body
        ? {
            method,
            headers,
            body: JSON.stringify(body),
          }
        : { method, headers },
    );
    return res.json();
  };
}
