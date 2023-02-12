import { getToken } from 'src/utils';

export default function useRequest(): (
  path: string,
  method: 'GET' | 'POST' | 'DELETE' | 'PATCH',
  body?: Record<string, unknown>,
) => Promise<Response> {
  const token = getToken();

  return async (path, method, body): Promise<Response> => {
    const headers: Record<string, string> = {
      'x-access-token': token ?? '',
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
    if (res.status >= 400 && res.status < 600) {
      throw new Error('Bad response from server');
    }
    return res;
  };
}
