import {all, call, fork, put, takeLatest} from 'redux-saga/effects';

import {Actions as CommonActions} from '../common/actions';
import {Actions as ContractActions} from '../contract/actions';
import {Actions as MerchantActions} from '../merchant/actions';
import {ActionWithPayload} from '../types';
import {Actions} from './actions';
import {ActionType} from './types';
import * as api from '../../apis';

function* loadCodeType(): any {
  try {
    const res = yield call(api.sku.getCodeTypes);
    yield put(Actions.loadCodeTypeSuccess(res));
  } catch (error) {
    yield put(CommonActions.error(error));
  }
}
function* loadSKUCategory(): any {
  try {
    const res = yield call(api.sku.getSPUCategories);
    yield put(Actions.loadSKUCategorySuccess(res));
  } catch (error) {
    yield put(CommonActions.error(error));
  }
}
function* loadSKUBuyNotice(): any {
  try {
    const res = yield call(api.sku.getSKUBuyNotice);
    yield put(Actions.loadSKUBuyNoticeSuccess(res));
  } catch (error) {
    yield put(CommonActions.error(error));
  }
}
function* loadCurrentSPU(action: ActionWithPayload<ActionType, number>): any {
  const spuId = action.payload;
  try {
    const res = yield call(api.sku.getSPUDetail, spuId);
    yield put(Actions.loadCurrentSPUSuccess(res));
  } catch (error) {
    yield put(CommonActions.error(error));
  }
}
function* endEdit() {
  yield put(MerchantActions.endEdit());
  yield put(ContractActions.endEdit());
}

function* watchSKUSagas() {
  yield takeLatest(ActionType.LOAD_CODE_TYPE, loadCodeType);
  yield takeLatest(ActionType.LOAD_SKU_CATEGORY, loadSKUCategory);
  yield takeLatest(ActionType.LOAD_SKU_BUY_NOTICE, loadSKUBuyNotice);
  yield takeLatest(ActionType.LOAD_CURRENT_SPU, loadCurrentSPU);
  yield takeLatest(ActionType.END_EDITING, endEdit);
}

export default function* SKUSagas() {
  yield all([fork(watchSKUSagas)]);
}
