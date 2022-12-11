import isNil from 'lodash/isNil';
import {all, call, fork, put, takeLatest} from 'redux-saga/effects';

import {Actions as CommonActions} from '../common/actions';
import {ActionWithPayload} from '../types';
import {Actions} from './actions';
import {ActionType} from './types';
import {merchant} from '../../apis';
import {MerchantSimpleF, PagedData, SearchParam} from '../../models';
import {formattingMerchantEdit} from '../../helper';

function* loadMerchantCategories(): any {
  try {
    const res = yield call(merchant.getMerchantCategories);
    yield put(Actions.loadMerchantCategoriesSuccess(res));
  } catch (error) {
    yield put(CommonActions.error(error));
  }
}
//加载私海
function* loadCurrentMerchantPrivate(action: ActionWithPayload<ActionType, number>): any {
  const id = action.payload;
  if (isNil(id)) {
    return yield put(Actions.loadCurrentMerchantPrivateSuccess(null as any));
  }
  try {
    const res = yield call(merchant.getMerchantDetail, id);
    const data = formattingMerchantEdit(res);
    yield put(Actions.loadCurrentMerchantPrivateSuccess(data));
  } catch (error) {
    yield put(CommonActions.error(error));
  }
}
//加载公海
function* loadCurrentMerchantPublic(action: ActionWithPayload<ActionType, number>): any {
  const id = action.payload;
  if (isNil(id)) {
    return yield put(Actions.loadCurrentMerchantPrivateSuccess(null as any));
  }
  try {
    const res = yield call(merchant.getMerchantDetail, id);
    const data = formattingMerchantEdit(res);
    yield put(Actions.loadCurrentMerchantPublicSuccess(data));
  } catch (error) {
    yield put(CommonActions.error(error));
  }
}
function* loadMerchantSearchList(action: ActionWithPayload<ActionType, SearchParam>) {
  const param = action.payload;
  try {
    const res: PagedData<MerchantSimpleF[]> = yield call(merchant.getMyMerchantSimple, {
      ...param,
      pageSize: 50,
    });
    yield put(Actions.loadMerchantSearchListSuccess(res.content));
  } catch (error) {
    yield put(CommonActions.error(error));
  }
}

export function* watchMerchantSagas() {
  yield takeLatest(ActionType.LOAD_MERCHANT_CATEGORIES, loadMerchantCategories);
  yield takeLatest(ActionType.LOAD_CURRENT_MERCHANT_PRIVATE, loadCurrentMerchantPrivate);
  yield takeLatest(ActionType.LOAD_CURRENT_MERCHANT_PUBLIC, loadCurrentMerchantPublic);
  yield takeLatest(ActionType.LOAD_MERCHANT_SEARCH_LIST, loadMerchantSearchList);
}

export default function* merchantSagas() {
  yield all([fork(watchMerchantSagas)]);
}
