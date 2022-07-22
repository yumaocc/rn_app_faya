import {all, call, fork, put, select, takeLatest} from 'redux-saga/effects';

import {Actions as CommonActions} from '../common/actions';
import {RootState} from '../reducers';
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
  const {payload} = action;
  const token = payload.token || '';
  yield put(CommonActions.setToken(token));
  //todo: 如果有其他信息，请放在这里，如用户信息和权限信息
}

function* getUserInfo(): any {
  try {
    const res = yield call(user.getUserInfo);
    yield put(Actions.getUserInfoSuccess(res));
    yield put(CommonActions.initAppSuccess());
  } catch (error) {
    yield put(CommonActions.error(error));
    yield put(Actions.logout());
  }
}

function* logout(): any {
  yield put(CommonActions.setToken(''));

  // 防止初始化登录失败导致应用状态错误
  const appInited: boolean = yield select(
    (state: RootState) => state.common.appInited,
  );
  if (!appInited) {
    yield put(CommonActions.initAppSuccess());
  }
}

function* certificate(
  action: ActionWithPayload<ActionType, CertificateParam>,
): any {
  const param = action.payload;
  try {
    const res = yield call(user.certificate, param);
    if (res) {
      // yield put(Actions.getUserInfo());
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

function* watchUserSagas() {
  yield takeLatest(ActionType.INIT, initUser);
  yield takeLatest(ActionType.LOGIN, login);
  yield takeLatest(ActionType.LOGOUT, logout);
  yield takeLatest(ActionType.LOGIN_SUCCESS, loginSuccess);
  yield takeLatest(ActionType.GET_USER_INFO, getUserInfo);
  yield takeLatest(ActionType.USER_CERTIFICATE, certificate);
  yield takeLatest(ActionType.GET_WALLET_INFO, getWalletInfo);
  yield takeLatest(ActionType.GET_SUPPORT_BANK_LIST, getSupportBankList);
}

export default function* userSagas() {
  yield all([fork(watchUserSagas)]);
}
