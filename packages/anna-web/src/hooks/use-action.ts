import React from 'react';
import { getToken } from 'src/utils';

export default function useAction(
  path: string,
): (e?: unknown) => Promise<void> {
  const token = getToken();

  const useAction = React.useCallback(
    async (e) => {
      e?.preventDefault();
      e?.stopPropagation();

      await fetch(path, {
        headers: {
          'x-access-token': token,
        },
      });
    },
    [path, token],
  );

  return useAction;
}
