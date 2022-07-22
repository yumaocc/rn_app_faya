import {all, put, takeLatest} from 'redux-saga/effects';

import {Actions as UserActions} from '../user/actions';
import {Actions} from './actions';
import {ActionType} from './types';
import {resetBaseURL, resetToken} from '../../apis/helper';
import {ERROR_SHOW_TIME, getBaseURL} from '../../constants';
import {cache, wait} from '../../helper';
import {ActionWithPayload} from '../types';

function* initApp(): any {
  const url = getBaseURL();
  resetBaseURL(url);

  const token = yield cache.config.getToken();
  yield put(Actions.setToken(token || ''));
  yield put(UserActions.init());
  if (token) {
    yield put(UserActions.getUserInfo());
  } else {
    yield put(Actions.initAppSuccess());
  }
}

function* dismissMessage() {
  yield wait(ERROR_SHOW_TIME);
  yield put(Actions.dismissMessage());
}

function* setToken(action: ActionWithPayload<ActionType, string>) {
  const token = action.payload;
  resetToken(token);
  yield cache.config.setToken(token);
}

function* watchCommonSagas() {
  yield takeLatest(ActionType.ERROR, dismissMessage);
  yield takeLatest(ActionType.SUCCESS, dismissMessage);
  yield takeLatest(ActionType.INFO, dismissMessage);
  yield takeLatest(ActionType.INIT_APP, initApp);
  yield takeLatest(ActionType.SET_TOKEN, setToken);
}

export default function* commonSagas() {
  yield all([watchCommonSagas()]);
}
