import React from 'react';
import { useUser } from 'context/user-context';

export default function useFetch<T>(path: string): T[] {
  const user = useUser();
  const [data, setData] = React.useState<T[]>([]);

  React.useEffect(() => {
    async function fetchData() {
      const res = await fetch(`http://192.168.1.17:8181${path}`, {
        headers: {
          'x-access-token': user ? user.token : '',
        },
      });
      setData(await res.json());
    }
    fetchData();
  }, [path, user]);

  return data;
}
