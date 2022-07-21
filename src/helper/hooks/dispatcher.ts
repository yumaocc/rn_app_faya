import {useMemo} from 'react';
import {useDispatch} from 'react-redux';
import {
  CommonDispatcher,
  getCommonDispatcher,
  getMerchantDispatcher,
  getSKUDispatcher,
  MerchantDispatcher,
  SKUDispatcher,
  UserDispatcher,
  getUserDispatcher,
  ContractDispatcher,
  getContractDispatcher,
  SummaryDispatcher,
  getSummaryDispatcher,
} from '../../redux/dispatchers';

export function useCommonDispatcher(): [CommonDispatcher] {
  const dispatch = useDispatch();
  const dispatcher = useMemo(() => getCommonDispatcher(dispatch), [dispatch]);
  return [dispatcher];
}
export function useMerchantDispatcher(): [MerchantDispatcher] {
  const dispatch = useDispatch();
  const dispatcher = useMemo(() => getMerchantDispatcher(dispatch), [dispatch]);
  return [dispatcher];
}
export function useSKUDispatcher(): [SKUDispatcher] {
  const dispatch = useDispatch();
  const dispatcher = useMemo(() => getSKUDispatcher(dispatch), [dispatch]);
  return [dispatcher];
}
export function useUserDispatcher(): [UserDispatcher] {
  const dispatch = useDispatch();
  const dispatcher = useMemo(() => getUserDispatcher(dispatch), [dispatch]);
  return [dispatcher];
}

export function useContractDispatcher(): [ContractDispatcher] {
  const dispatch = useDispatch();
  const dispatcher = useMemo(() => getContractDispatcher(dispatch), [dispatch]);
  return [dispatcher];
}

export function useSummaryDispatcher(): [SummaryDispatcher] {
  const dispatch = useDispatch();
  const dispatcher = useMemo(() => getSummaryDispatcher(dispatch), [dispatch]);
  return [dispatcher];
}
