import {all, call, fork, put, takeLatest} from 'redux-saga/effects';

import {Actions as CommonActions} from '../common/actions';
import {ActionWithPayload} from '../types';
import {Actions} from './actions';
import {ActionType} from './types';
import {user} from '../../apis';
import {cache, wait} from '../../helper';
import {CertificateParam, LoginParam, UserInfo} from '../../models';

function* initUser(): any {
  const phone = yield cache.user.getPhone();
  yield put(Actions.initSuccess(phone || ''));
}

function* login(action: ActionWithPayload<ActionType, LoginParam>): any {
  const {payload} = action;
  try {
    const res = yield call(user.userLogin, payload);
    yield put(Actions.loginSuccess(res));
    yield cache.user.setPhone(payload.phone);
  } catch (error) {
    yield put(Actions.loginError());
    yield put(CommonActions.error(error));
  }

  // 不管成功还是失败，稍后还原登录状态
  yield wait(1000);
  yield put(Actions.resetLoginState());
}

function* loginSuccess(action: ActionWithPayload<ActionType, UserInfo>): any {
  yield put(Actions.setUserInfo(action.payload));
  yield put(CommonActions.setToken(action.payload?.token));
}

function* logout(): any {
  yield put(CommonActions.setToken(''));
  yield put(Actions.logoutSuccess());
}

function* certificate(action: ActionWithPayload<ActionType, CertificateParam>): any {
  const param = action.payload;
  try {
    const res = yield call(user.certificate, param);
    if (res) {
      yield put(CommonActions.success('认证成功!'));
      yield put(Actions.certificateSuccess());
    }
  } catch (error) {
    yield put(CommonActions.error(error));
  }
}
function* getWalletInfo(): any {
  try {
    const res = yield call(user.getWallet);
    yield put(Actions.getWalletInfoSuccess(res));
  } catch (error) {
    yield put(CommonActions.error(error));
  }
}
function* getSupportBankList(): any {
  try {
    const res = yield call(user.getSupportBankList);
    yield put(Actions.getSupportBankListSuccess(res));
  } catch (error) {
    yield put(CommonActions.error(error));
  }
}
function* loadUserInfo() {
  try {
    const res: UserInfo = yield call(user.getUserInfo);
    yield put(Actions.setUserInfo(res));
  } catch (error) {
    yield put(CommonActions.error(error));
  }
}

function* watchUserSagas() {
  yield takeLatest(ActionType.INIT, initUser);
  yield takeLatest(ActionType.LOGIN, login);
  yield takeLatest(ActionType.LOGOUT, logout);
  yield takeLatest(ActionType.LOGIN_SUCCESS, loginSuccess);
  yield takeLatest(ActionType.USER_CERTIFICATE, certificate);
  yield takeLatest(ActionType.GET_WALLET_INFO, getWalletInfo);
  yield takeLatest(ActionType.GET_SUPPORT_BANK_LIST, getSupportBankList);
  yield takeLatest(ActionType.LOAD_USER_INFO, loadUserInfo);
}

export default function* userSagas() {
  yield all([fork(watchUserSagas)]);
}
