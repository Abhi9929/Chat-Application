import { useEffect, useState } from "react";

export function useDebounce(query, delay) {
  const [debouncedValue, setDebouncedValue] = useState('');
  useEffect(() => {
    const timeOut = setTimeout(() => {
      setDebouncedValue(query);
    }, delay);
    return () => clearTimeout(timeOut);
  }, [query]);

  return debouncedValue;
}