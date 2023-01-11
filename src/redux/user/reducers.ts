import produce from 'immer';
import {UserActions} from './actions';
// import { ActionType } from './types';
import {ActionType} from './types';
import {Bank, LoginState, UserInfo, UserState as UserStateType, WalletInfo} from '../../models';

export interface UserState {
  phone: string;
  isLogout: boolean;
  userInfo?: UserInfo;
  loginState: LoginState;
  wallet?: WalletInfo;
  supportBankList: Bank[];
}

export const initialState: UserState = {
  phone: '',
  isLogout: false,
  loginState: LoginState.None,
  supportBankList: [],
};

export default (state = initialState, action: UserActions): UserState => {
  const {type} = action;

  switch (type) {
    case ActionType.INIT_SUCCESS:
      return produce(state, draft => {
        draft.phone = action.payload;
      });
    case ActionType.LOGIN:
      return produce(state, draft => {
        draft.phone = action.payload.phone;
        draft.loginState = LoginState.Loading;
      });
    case ActionType.LOGIN_SUCCESS:
      return produce(state, draft => {
        const {payload} = action;
        //todo: 如果有其他信息，请放在这里，如用户信息和权限信息
        draft.loginState = LoginState.Success;
        draft.userInfo = payload;
      });
    case ActionType.LOGIN_ERROR:
      return produce(state, draft => {
        draft.loginState = LoginState.Error;
      });
    case ActionType.LOGOUT_SUCCESS:
      return produce(state, draft => {
        draft.userInfo = undefined;
        draft.wallet = undefined;
      });
    case ActionType.RESET_LOGIN_STATE:
      return produce(state, draft => {
        draft.loginState = LoginState.None;
      });
    case ActionType.SET_USER_INFO:
      return produce(state, draft => {
        const {payload} = action;
        draft.userInfo = payload;
      });
    case ActionType.LOGOUT:
      return produce(state, draft => {
        draft.userInfo = undefined;
        draft.wallet = undefined;
        draft.isLogout = true;
      });
    case ActionType.USER_CERTIFICATE_SUCCESS:
      return produce(state, draft => {
        if (draft.userInfo) {
          draft.userInfo.status = UserStateType.CERTIFIED;
        }
      });
    case ActionType.GET_WALLET_INFO_SUCCESS:
      return produce(state, draft => {
        const {payload} = action;
        draft.wallet = payload;
      });
    case ActionType.GET_SUPPORT_BANK_LIST_SUCCESS:
      return produce(state, draft => {
        const {payload} = action;
        draft.supportBankList = payload;
      });
    default:
      return state;
  }
};
