import isNil from 'lodash/isNil';
import {all, call, fork, put, select, takeLatest} from 'redux-saga/effects';
import * as api from '../../apis';
import {Actions as CommonActions} from '../common/actions';
import {ActionWithPayload} from '../types';
import {Actions} from './actions';
import {ActionType} from './types';
import {merchant} from '../../apis';
import {MerchantF, MerchantSimpleF, PagedData, PageParam, SearchParam} from '../../models';
import {formattingMerchantEdit} from '../../helper';
import {RootState} from '../reducers';
import {MerchantList} from '../../models/merchant';

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
    const res = yield call(merchant.getPublicMerchantDetail, id);
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

//公海分页
function* loadPublicMerchantList(action: ActionWithPayload<ActionType, SearchParam>) {
  const params = action.payload;
  try {
    const {replace, index, pull, ...param} = params;
    const pageSize = 10;
    const pageIndex = replace ? 1 : index + 1;
    const searchParam = {
      pageSize,
      pageIndex,
      ...param,
    };
    if (!pull) {
      yield put(Actions.loadMerchantLoading());
    }
    yield put(Actions.changeLoadingStatePublic());
    const res: PagedData<MerchantF[]> = yield call(api.merchant.getPublicSeaMerchants, searchParam);
    if (!res?.content?.length) {
      const page: PageParam = yield select((state: RootState) => state.merchant.merchantPublicList.page);
      res.page = page;
    }
    if (!replace) {
      const merchant: MerchantF[] = yield select((state: RootState) => state.merchant?.merchantPublicList?.content);
      res.content = [...merchant, ...res?.content];
    }
    const merchantList = {
      content: res.content,
      page: res.page,
      status: res.content.length < pageSize ? 'noMore' : 'none',
    } as MerchantList<MerchantF[]>;
    yield put(Actions.loadPublicMerchantListSuccess(merchantList));
  } catch (error) {
    yield put(CommonActions.error(error));
  }
}

//私海分页
function* loadPrivateMerchantList(action: ActionWithPayload<ActionType, SearchParam>) {
  const params = action.payload;

  try {
    const {replace, index, pull, ...param} = params;
    const pageSize = 10;
    const pageIndex = replace ? 1 : index + 1;
    const searchParam = {
      pageSize,
      pageIndex,
      ...param,
    };
    if (!pull) {
      yield put(Actions.loadMerchantLoading());
    }
    yield put(Actions.changeLoadingStatePrivate());
    const res: PagedData<MerchantF[]> = yield call(api.merchant.getPrivateSeaMerchants, searchParam);
    if (!res?.content?.length) {
      const page: PageParam = yield select((state: RootState) => state.merchant.merchantPrivateList.page);
      res.page = page;
    }
    if (!replace) {
      const merchant: MerchantF[] = yield select((state: RootState) => state.merchant?.merchantPrivateList?.content);
      res.content = [...merchant, ...res?.content];
    }
    const merchantList = {
      content: res.content,
      page: res.page,
      status: res.content.length < pageSize ? 'noMore' : 'none',
    } as MerchantList<MerchantF[]>;
    yield put(Actions.loadPrivateMerchantLisSuccess(merchantList));
  } catch (error) {
    yield put(CommonActions.error(error));
  }
}

export function* watchMerchantSagas() {
  yield takeLatest(ActionType.LOAD_MERCHANT_CATEGORIES, loadMerchantCategories);
  yield takeLatest(ActionType.LOAD_CURRENT_MERCHANT_PRIVATE, loadCurrentMerchantPrivate);
  yield takeLatest(ActionType.LOAD_CURRENT_MERCHANT_PUBLIC, loadCurrentMerchantPublic);
  yield takeLatest(ActionType.LOAD_MERCHANT_SEARCH_LIST, loadMerchantSearchList);

  yield takeLatest(ActionType.LOAD_MERCHANT_PUBLIC_LIST, loadPublicMerchantList);
  yield takeLatest(ActionType.LOAD_MERCHANT_PRIVATE_LIST, loadPrivateMerchantList);
}

export default function* merchantSagas() {
  yield all([fork(watchMerchantSagas)]);
}
