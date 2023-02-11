import React from 'react';
import { useUser } from 'hooks/use-user';

export default function useAction(
  path: string,
): (e?: unknown) => Promise<void> {
  const user = useUser();

  const useAction = React.useCallback(
    async (e) => {
      e?.preventDefault();
      e?.stopPropagation();

      await fetch(path, {
        headers: {
          'x-access-token': user && user.token ? user.token : '',
        },
      });
    },
    [path, user],
  );

  return useAction;
}
