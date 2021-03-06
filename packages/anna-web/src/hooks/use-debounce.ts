import React from 'react';

let timeout = -1;

function useDebounce(func: Function, wait: number) {
  return React.useMemo(() => {
    const debounced = (...args: unknown[]) => {
      window.clearTimeout(timeout);
      timeout = window.setTimeout(() => func(...args), wait);
    };

    debounced.clear = () => {
      window.clearTimeout(timeout);
    };

    return debounced;
  }, [func, wait]);
}

export default useDebounce;
