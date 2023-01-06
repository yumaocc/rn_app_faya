import {Action, ActionsUnion, ActionWithPayload, createAction} from '../types';
import {ActionType} from './types';
import {Bank, CertificateParam, LoginParam, UserInfo, WalletInfo} from '../../models';

export const Actions = {
  init: (): Action<ActionType.INIT> => createAction(ActionType.INIT),
  initSuccess: (phone: string): ActionWithPayload<ActionType.INIT_SUCCESS, string> => createAction(ActionType.INIT_SUCCESS, phone),
  login: (loginParam: LoginParam): ActionWithPayload<ActionType.LOGIN, LoginParam> => createAction(ActionType.LOGIN, loginParam),

  loginSuccess: (userInfo: UserInfo): ActionWithPayload<ActionType.LOGIN_SUCCESS, UserInfo> => createAction(ActionType.LOGIN_SUCCESS, userInfo),

  loginError: (): Action<ActionType.LOGIN_ERROR> => createAction(ActionType.LOGIN_ERROR),

  resetLoginState: (): Action<ActionType.RESET_LOGIN_STATE> => createAction(ActionType.RESET_LOGIN_STATE),
  loadUserInfo: (): Action<ActionType.LOAD_USER_INFO> => createAction(ActionType.LOAD_USER_INFO),

  setUserInfo: (userInfo?: UserInfo): ActionWithPayload<ActionType.SET_USER_INFO, UserInfo> => createAction(ActionType.SET_USER_INFO, userInfo),

  logout: (): Action<ActionType.LOGOUT> => createAction(ActionType.LOGOUT),
  logoutSuccess: (): Action<ActionType.LOGOUT_SUCCESS> => createAction(ActionType.LOGOUT_SUCCESS),
  certificate: (param: CertificateParam): ActionWithPayload<ActionType.USER_CERTIFICATE, CertificateParam> => createAction(ActionType.USER_CERTIFICATE, param),

  certificateSuccess: (): Action<ActionType.USER_CERTIFICATE_SUCCESS> => createAction(ActionType.USER_CERTIFICATE_SUCCESS),

  getWalletInfo: (): Action<ActionType.GET_WALLET_INFO> => createAction(ActionType.GET_WALLET_INFO),
  getWalletInfoSuccess: (walletInfo: WalletInfo): ActionWithPayload<ActionType.GET_WALLET_INFO_SUCCESS, WalletInfo> => createAction(ActionType.GET_WALLET_INFO_SUCCESS, walletInfo),
  getSupportBankList: (): Action<ActionType.GET_SUPPORT_BANK_LIST> => createAction(ActionType.GET_SUPPORT_BANK_LIST),
  getSupportBankListSuccess: (bankList: Bank[]): ActionWithPayload<ActionType.GET_SUPPORT_BANK_LIST_SUCCESS, Bank[]> =>
    createAction(ActionType.GET_SUPPORT_BANK_LIST_SUCCESS, bankList),
};

export type UserActions = ActionsUnion<typeof Actions>;
