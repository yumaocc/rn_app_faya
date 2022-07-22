import {all, call, fork, put, takeLatest} from 'redux-saga/effects';

import {Actions as CommonActions} from '../common/actions';
import {ActionWithPayload} from '../types';
import {Actions} from './actions';
import {ActionType} from './types';
import {summary} from '../../apis';
import {DateTimeRange} from '../../models';

function* loadHome(): any {
  try {
    const res = yield call(summary.loadHome);
    yield put(Actions.loadHomeSuccess(res));
  } catch (error) {
    yield put(CommonActions.error(error));
  }
}
function* loadCommissionToday(): any {
  try {
    const res = yield call(summary.loadCommissionToday);
    yield put(Actions.loadCommissionTodaySuccess(res));
  } catch (error) {
    yield put(CommonActions.error(error));
  }
}

function* loadCommissionExpect(): any {
  try {
    const res = yield call(summary.loadCommissionExpect);
    yield put(Actions.loadCommissionExpectSuccess(res));
  } catch (error) {
    yield put(CommonActions.error(error));
  }
}

function* loadCommissionTop(
  action: ActionWithPayload<ActionType, DateTimeRange>,
): any {
  const [start, end] = action.payload;
  try {
    const res = yield call(summary.loadCommissionTop, start, end);
    yield put(Actions.loadCommissionTopSuccess(res));
  } catch (error) {
    yield put(CommonActions.error(error));
  }
}

function* loadSalesTop(
  action: ActionWithPayload<ActionType, DateTimeRange>,
): any {
  const [start, end] = action.payload;
  try {
    const res = yield call(summary.loadSalesTop, start, end);
    yield put(Actions.loadSalesTopSuccess(res));
  } catch (error) {
    yield put(CommonActions.error(error));
  }
}

function* loadCommissionHistory(): any {
  try {
    const res = yield call(summary.loadCommissionHistory);
    yield put(Actions.loadCommissionHistorySuccess(res));
  } catch (error) {
    yield put(CommonActions.error(error));
  }
}

function* watchSummarySagas() {
  yield takeLatest(ActionType.LOAD_HOME, loadHome);
  yield takeLatest(ActionType.LOAD_COMMISSION_TODAY, loadCommissionToday);
  yield takeLatest(ActionType.LOAD_COMMISSION_EXPECT, loadCommissionExpect);
  yield takeLatest(ActionType.LOAD_SPU_COMMISSION_TOP, loadCommissionTop);
  yield takeLatest(ActionType.LOAD_SPU_SALES_TOP, loadSalesTop);
  yield takeLatest(ActionType.LOAD_COMMISSION_HISTORY, loadCommissionHistory);
}

export default function* summarySagas() {
  yield all([fork(watchSummarySagas)]);
}
