import React from 'react';
import { useUser } from 'hooks/use-user';

export default function useFetch<T>(path: string): T | null {
  const user = useUser();
  const [data, setData] = React.useState<T | null>(null);

  React.useEffect(() => {
    async function fetchData() {
      if (user) {
        const res = await fetch(path, {
          headers: {
            'x-access-token': user.token ?? '',
          },
        });
        setData(await res.json());
      }
    }
    fetchData();
  }, [path, user]);

  return data;
}
