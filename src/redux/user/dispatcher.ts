import {Dispatch} from 'redux';
import {Actions} from './actions';
import {CertificateParam, LoginParam} from '../../models';

export interface UserDispatcher {
  login(param: LoginParam): void;
  logout(): void;
  getUserInfo(): void;
  resetLoginState(): void;
  certificate(param: CertificateParam): void;
  getWallet(): void;
  getSupportBankList(): void;
}

export const getUserDispatcher = (dispatch: Dispatch): UserDispatcher => ({
  login: (param: LoginParam) => dispatch(Actions.login(param)),
  logout: () => dispatch(Actions.logout()),
  resetLoginState: () => dispatch(Actions.resetLoginState()),
  getUserInfo: () => dispatch(Actions.getUserInfo()),
  certificate: (param: CertificateParam) =>
    dispatch(Actions.certificate(param)),
  getWallet: () => dispatch(Actions.getWalletInfo()),
  getSupportBankList: () => dispatch(Actions.getSupportBankList()),
});