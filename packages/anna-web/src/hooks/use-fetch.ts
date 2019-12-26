import React from 'react';
import { useUser } from 'context/user-context';

export default function useFetch<T>(path: string): T | null {
  const user = useUser();
  const [data, setData] = React.useState<T | null>(null);

  React.useEffect(() => {
    async function fetchData() {
      const res = await fetch(path, {
        headers: {
          'x-access-token': user && user.token ? user.token : '',
        },
      });
      setData(await res.json());
    }
    fetchData();
  }, [path, user]);

  return data;
}
