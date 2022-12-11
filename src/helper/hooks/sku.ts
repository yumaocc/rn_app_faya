import {useEffect} from 'react';
import {useSelector} from 'react-redux';

import {useFetchData} from './common';
import {useSKUDispatcher} from './dispatcher';
import * as api from '../../apis';
import {SKUBuyNotice, SPUCategory, SPUCodeType, SPUDetailF} from '../../models';
import {RootState} from '../../redux/reducers';

export function useSPUCategories(): [SPUCategory[]] {
  const SPUCategories = useSelector((state: RootState) => state.sku.categories);
  const [SKUDispatcher] = useSKUDispatcher();
  useEffect(() => {
    if (SPUCategories.length <= 0) {
      SKUDispatcher.loadSKUCategory();
    }
  }, [SKUDispatcher, SPUCategories]);

  return [SPUCategories];
}

export function useCodeTypes(): [SPUCodeType[]] {
  const SPUCodeTypes = useSelector((state: RootState) => state.sku.codeTypes);
  const [SKUDispatcher] = useSKUDispatcher();
  useEffect(() => {
    if (SPUCodeTypes.length <= 0) {
      SKUDispatcher.loadCodeType();
    }
  }, [SKUDispatcher, SPUCodeTypes]);
  return [SPUCodeTypes];
}

export function useSKUBuyNotice(): [SKUBuyNotice] {
  const notices = useSelector((state: RootState) => state.sku.buyNotice);
  const [SKUDispatcher] = useSKUDispatcher();
  useEffect(() => {
    if (!notices) {
      SKUDispatcher.loadSKUBuyNotice();
    }
  }, [SKUDispatcher, notices]);
  return [notices as SKUBuyNotice];
}

// 获取spu详情
export function useSPUDetail(spuId?: number): [SPUDetailF, () => void] {
  return useFetchData(api.sku.getSPUDetail, spuId);
}
