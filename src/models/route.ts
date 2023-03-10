import {ReactNode} from 'react';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {MerchantCreateType, ShopForm} from './merchant';

/**
 * @deprecated rn 不支持
 */
export interface RouteItem {
  path: string;
  component: ReactNode;
}

/**
 * @deprecated rn 不支持
 */
interface NavigationItemObject {
  title: string;
  to?: string;
}

/**
 * @deprecated rn 不支持
 */
export type NavigationItem = NavigationItemObject | string;

export type ValidRoute = keyof RootStackParamList;
export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Merchant: {tab: string};
  Tab: undefined;
  AddMerchant: {type: MerchantCreateType} | undefined;
  EditContract: {id: number};
  AddContract: undefined;
  ContractList: undefined;
  EditSPU: {id: number; bizId?: number};
  AddSPU: {bizId?: number};
  SPUList: undefined;
  SPUDetail: {id: number};
  Demo: undefined;
  ViewMerchant: {id: number};
  Cash: undefined;
  Withdraw: undefined;
  Success: undefined;
  WithdrawalsRecord: undefined;
  EstimatedIncome: undefined;
  HistoricalEarnings: undefined;
  TodayEarnings: undefined;
  MyMerchantDetail: {id: number; name: string; status: number};
  ShopDetail: {shopDetail: ShopForm; id: number};
  ShopList: {id: number};
  IconTest: undefined;
  CommodityTopList: undefined;
  SalesTopList: undefined;
  MineDetail: undefined;
  Cert: undefined;
  ViewContract: undefined;
  Browser: undefined;
  Settings: undefined;
};

export type Props = NativeStackScreenProps<RootStackParamList>;

// navigation的类型有问题，一堆类型。用这个类型代替
export type FakeNavigation = {
  navigate<Params = any>(name: keyof RootStackParamList, params?: Params): void;
  navigate<Params = any>(options: {name: keyof RootStackParamList; params: Params}): void;
};

export type FakeRoute<Params = any> = {
  params?: Params;
};
