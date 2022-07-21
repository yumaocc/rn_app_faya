import {useEffect, useState, useCallback} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import {useFetchData, useForceUpdate} from './common';
import * as api from '../../apis';
import {
  MerchantBookingModelF,
  MerchantCategory,
  MerchantDetailF,
  ShopF,
} from '../../models';
import {getMerchantDispatcher} from '../../redux/dispatchers';
import {RootState} from '../../redux/reducers';

// 即时版，商家详情
export function useMerchantDetail(id: number): [MerchantDetailF, () => void] {
  const [detail, forceUpdate] = useFetchData<MerchantDetailF>(
    api.merchant.getMerchantDetail,
    id,
  );
  return [detail, forceUpdate];
}

// 公海商家详情
export function usePublicMerchantDetail(
  id: number,
): [MerchantDetailF, () => void] {
  const [detail, forceUpdate] = useFetchData<MerchantDetailF>(
    api.merchant.getPublicMerchantDetail,
    id,
  );
  return [detail, forceUpdate];
}

export function useMerchantCategory(): [MerchantCategory[]] {
  const merchantCategories = useSelector(
    (state: RootState) => state.merchant.merchantCategories,
  );
  const dispatch = useDispatch();
  const merchantDispatcher = getMerchantDispatcher(dispatch);
  useEffect(() => {
    if (!merchantCategories?.length) {
      merchantDispatcher.loadMerchantCategories();
    }
  }, [merchantCategories, merchantDispatcher]);
  return [merchantCategories];
}

export function useMerchantShopList(id: number): [ShopF[], () => void] {
  const [signal, forceUpdate] = useForceUpdate();
  const [shopList, setShopList] = useState<ShopF[]>([]);

  const fetch = useCallback((merchantId: number) => {
    api.merchant
      .getShops(merchantId)
      .then(res => {
        setShopList(res);
      })
      .catch(console.log);
  }, []);

  useEffect(() => {
    if (id) {
      fetch(id);
    }
  }, [fetch, id, signal]);

  return [shopList, forceUpdate];
}

export function useMerchantBookingModel(
  merchantId: number,
): [MerchantBookingModelF[], () => void] {
  return useFetchData(api.merchant.getMerchantBookingModel, merchantId);
}
