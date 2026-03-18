import { useEffect, useState } from 'react';

export const useLocalStorage = <T,>(key: string, initialValue: T | (() => T)) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return typeof initialValue === 'function' ? (initialValue as () => T)() : initialValue;
    }

    const item = window.localStorage.getItem(key);
    if (item) {
      return JSON.parse(item) as T;
    }

    return typeof initialValue === 'function' ? (initialValue as () => T)() : initialValue;
  });

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(storedValue));
  }, [key, storedValue]);

  return [storedValue, setStoredValue] as const;
};
