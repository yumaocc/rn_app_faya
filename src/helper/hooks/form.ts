import {useCallback, useState} from 'react';

import {SearchForm} from '../../models';

export function useSearch<T extends SearchForm>(
  initial: T = {} as T,
): [T, (key: keyof T, value: T[keyof T]) => void] {
  const [search, setSearch] = useState<T>(initial);
  const setField = useCallback((key: keyof T, value: T[keyof T]) => {
    setSearch(prev => {
      return {
        ...prev,
        [key]: value,
      };
    });
  }, []);

  return [search, setField];
}
