import isNil from 'lodash/isNil';
import {all, call, fork, put, takeLatest} from 'redux-saga/effects';

import {Actions as CommonActions} from '../common/actions';
import {ActionWithPayload} from '../types';
import {Actions} from './actions';
import {ActionType} from './types';
import {merchant} from '../../apis';
import {MerchantSimpleF, PagedData, SearchParam} from '../../models';

function* loadMerchantCategories() {
  try {
    const res = yield call(merchant.getMerchantCategories);
    yield put(Actions.loadMerchantCategoriesSuccess(res));
  } catch (error) {
    yield put(CommonActions.error(error));
  }
}
function* loadCurrentMerchant(action: ActionWithPayload<ActionType, number>) {
  const id = action.payload;
  if (isNil(id)) {
    return yield put(Actions.loadCurrentMerchantSuccess(null as any));
  }
  try {
    const res = yield call(merchant.getMerchantDetail, id);
    yield put(Actions.loadCurrentMerchantSuccess(res));
  } catch (error) {
    yield put(CommonActions.error(error));
  }
}
function* loadMerchantSearchList(
  action: ActionWithPayload<ActionType, SearchParam>,
) {
  const param = action.payload;
  try {
    const res: PagedData<MerchantSimpleF[]> = yield call(
      merchant.getMyMerchantSimple,
      {
        ...param,
        pageSize: 50,
      },
    );
    yield put(Actions.loadMerchantSearchListSuccess(res.content));
  } catch (error) {
    yield put(CommonActions.error(error));
  }
}

export function* watchMerchantSagas() {
  yield takeLatest(ActionType.LOAD_MERCHANT_CATEGORIES, loadMerchantCategories);
  yield takeLatest(ActionType.LOAD_CURRENT_MERCHANT, loadCurrentMerchant);
  yield takeLatest(
    ActionType.LOAD_MERCHANT_SEARCH_LIST,
    loadMerchantSearchList,
  );
}

export default function* merchantSagas() {
  yield all([fork(watchMerchantSagas)]);
}
