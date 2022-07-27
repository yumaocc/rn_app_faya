import {useCallback, useState} from 'react';
import {ImageLibraryOptions, launchImageLibrary, Asset} from 'react-native-image-picker';

import {SearchForm} from '../../models';

export function useSearch<T extends SearchForm>(initial: T = {} as T): [T, (key: keyof T, value: T[keyof T]) => void] {
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

export function useRNSelectPhoto(): [(option?: Partial<ImageLibraryOptions>) => Promise<Asset[]>] {
  const openGallery = useCallback(async (option: Partial<ImageLibraryOptions> = {}) => {
    const defaultOptions: ImageLibraryOptions = {
      mediaType: 'photo',
      quality: 0.5,
      selectionLimit: 6,
    };
    const mergedOptions = {...defaultOptions, ...option};
    try {
      const res = await launchImageLibrary(mergedOptions);
      if (res.didCancel) {
        return [];
      }
      return res.assets || [];
    } catch (error) {
      return [];
    }
  }, []);
  return [openGallery];
}
