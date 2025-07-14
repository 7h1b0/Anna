import React from 'react';

export default function useAction(
  path: string,
): (e?: unknown) => Promise<void> {
  const useAction = React.useCallback(
    async (e) => {
      e?.preventDefault();
      e?.stopPropagation();

      await fetch(path);
    },
    [path],
  );

  return useAction;
}
