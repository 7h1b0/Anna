import React from 'react';
import { useUser } from 'context/user-context';

export default function useAction(path: string): () => Promise<void> {
  const user = useUser();

  const useAction = React.useCallback(async () => {
    await fetch(path, {
      headers: {
        'x-access-token': user && user.token ? user.token : '',
      },
    });
  }, [path, user]);

  return useAction;
}
