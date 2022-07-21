import {useCallback, useEffect, useState} from 'react';
import {useFetchData, useForceUpdate} from './common';
import * as api from '../../apis';
import {ContractDetailF, ContractF} from '../../models';

export function useContractDetail(id: number): [ContractDetailF, () => void] {
  return useFetchData<ContractDetailF>(api.contract.getContractDetail, id);
}

export function useMerchantContract(id: number): [ContractF[], () => void] {
  const [signal, forceUpdate] = useForceUpdate();
  const [contractList, setContractList] = useState<ContractF[]>([]);

  const fetch = useCallback((merchantId: number) => {
    api.contract
      .getContractList({id: merchantId})
      .then(res => {
        setContractList(res.content);
      })
      .catch(console.log);
  }, []);

  useEffect(() => {
    if (id) {
      fetch(id);
    }
  }, [fetch, id, signal]);

  return [contractList, forceUpdate];
}
