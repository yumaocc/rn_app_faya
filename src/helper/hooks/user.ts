import {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {useForceUpdate} from './common';
import {useUserDispatcher} from './dispatcher';
import {Bank, UserInfo, UserState, WalletInfo} from '../../models';
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
  const bankList = useSelector((state: RootState) => state.user.supportBankList);
  const [userDispatcher] = useUserDispatcher();

  useEffect(() => {
    if (!bankList?.length) {
      userDispatcher.getSupportBankList();
    }
  }, [bankList, userDispatcher]);

  return [bankList];
}

export function useUserAuthInfo() {
  const [isShowModal, setIsShowModal] = useState(false);
  const userInfo = useSelector<RootState, UserInfo>(state => state.user.userInfo);
  const [userDispatcher] = useUserDispatcher();
  const onChangeAuthModal = (value: boolean) => {
    setIsShowModal(value);
  };
  useEffect(() => {
    if (!userInfo) {
      userDispatcher.loadUserInfo();
    }
  }, [userDispatcher, userInfo]);
  return {
    isShowAuthModal: isShowModal,
    onChangeAuthModal: onChangeAuthModal,
    userAuth: userInfo?.status === UserState.UN_CERTIFIED ? false : true, //false 未认证 ，true  已认证
  };
}
