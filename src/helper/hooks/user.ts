import {useEffect} from 'react';
import {useSelector} from 'react-redux';
import {useForceUpdate} from './common';
import {useUserDispatcher} from './dispatcher';
import {Bank, WalletInfo} from '../../models';
import {RootState} from '../../redux/reducers';

export function useWallet(): [WalletInfo, () => void] {
  const [signal, forceUpdate] = useForceUpdate();
  const walletInfo = useSelector((state: RootState) => state.user.wallet);
  const [userDispatcher] = useUserDispatcher();

  useEffect(() => {
    if (!walletInfo) {
      userDispatcher.getWallet();
    }
  }, [walletInfo, userDispatcher]);

  useEffect(() => {
    if (signal) {
      userDispatcher.getWallet();
    }
  }, [signal, userDispatcher]);

  return [walletInfo as WalletInfo, forceUpdate];
}

export function useBankList(): [Bank[]] {
  const bankList = useSelector(
    (state: RootState) => state.user.supportBankList,
  );
  const [userDispatcher] = useUserDispatcher();

  useEffect(() => {
    if (!bankList?.length) {
      userDispatcher.getSupportBankList();
    }
  }, [bankList, userDispatcher]);

  return [bankList];
}
