import isNil from 'lodash/isNil';
import {takeLatest, all, fork, call, put, select} from 'redux-saga/effects';

import {Actions as CommonActions} from '../common/actions';
import {ActionWithPayload} from '../types';
import {Actions} from './actions';
import {ActionType} from './types';
import * as api from '../../apis';
import {Contract, ContractList, PagedData, SearchForm, SearchParam} from '../../models';
import {RootState} from '../reducers';
import {MerchantList} from '../../models/merchant';

function* loadCurrentContract(action: ActionWithPayload<ActionType.LOAD_CURRENT_CONTRACT, number>): any {
  const contractId = action.payload;
  if (isNil(contractId)) {
    return yield put(Actions.loadCurrentContractSuccess(undefined as any));
  }
  try {
    const res: Contract = yield call(api.contract.getContractDetail, contractId);
    yield put(Actions.loadCurrentContractSuccess(res));
  } catch (error) {
    yield put(CommonActions.error(error));
  }
}

function* loadContractSearchList(action: ActionWithPayload<ActionType, SearchForm>): any {
  try {
    const res: PagedData<ContractList[]> = yield call(api.contract.getContractList, action.payload);
    yield put(Actions.loadContractSearchListSuccess(res.content));
  } catch (error) {
    yield put(CommonActions.error(error));
  }
}

//合同列表
function* loadContractList(action: ActionWithPayload<ActionType, SearchParam>) {
  // const params = action.payload;
  // try {
  //   const {replace, index, pull, ...param} = params;
  //   const pageSize = 10;
  //   const pageIndex = replace ? 1 : index + 1;
  //   const searchParam = {
  //     pageSize,
  //     pageIndex,
  //     ...param,
  //   };
  //   if (!pull) {
  //     yield put(Actions.loadContractLoading());
  //   }
  //   yield put(Actions.changeLoadingState());
  //   const res: PagedData<ContractList[]> = yield call(api.contract.getMyContractList, searchParam);
  //   const status = res.content?.length < pageSize ? 'noMore' : 'none';
  //   if (!res?.content?.length) {
  //     const page: PageParam = yield select((state: RootState) => state.merchant.merchantPublicList.page);
  //     res.page = page;
  //   }
  //   if (!replace) {
  //     const merchant: ContractList[] = yield select((state: RootState) => state.merchant?.merchantPublicList?.content);
  //     res.content = [...merchant, ...res?.content];
  //   }
  //   const merchantList = {
  //     content: res.content,
  //     page: res.page,
  //     status,
  //   } as MerchantList<ContractList[]>;
  //   console.log('数据', merchantList);
  //   yield put(Actions.loadContractListSuccess(merchantList));
  // } catch (error) {
  //   yield put(CommonActions.error(error));
  // }
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
      yield put(Actions.loadContractLoading());
    }
    yield put(Actions.changeLoadingState());

    const res: PagedData<ContractList[]> = yield call(api.contract.getMyContractList, searchParam);
    const status = res.content?.length < pageSize ? 'noMore' : 'none';
    if (!replace) {
      const merchant: ContractList[] = yield select((state: RootState) => state.contract.contractList.content);
      res.content = [...merchant, ...res?.content];
    }
    const merchantList = {
      content: res.content,
      page: res.page,
      status,
    } as MerchantList<ContractList[]>;
    yield put(Actions.loadContractListSuccess(merchantList));
  } catch (error) {
    yield put(CommonActions.error(error));
  }
}

export function* watchContractSagas() {
  yield takeLatest(ActionType.LOAD_CURRENT_CONTRACT, loadCurrentContract);
  yield takeLatest(ActionType.LOAD_CONTRACT_SEARCH_LIST, loadContractSearchList);
  yield takeLatest(ActionType.LOAD_CONTRACT_LIST, loadContractList);
}

export default function* contractSagas() {
  yield all([fork(watchContractSagas)]);
}
