import React from 'react';

let timeout: number = -1;

function useDebounce(func: Function, wait: number) {
  return React.useMemo(() => {
    const debounced = (...args: any[]) => {
      window.clearTimeout(timeout);
      timeout = window.setTimeout(() => func(...args), wait);
    };

    debounced.clear = () => {
      window.clearTimeout(timeout);
    };

    return debounced;
  }, [func]);
}

export default useDebounce;
