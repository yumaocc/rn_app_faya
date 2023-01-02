import isNil from 'lodash/isNil';
import {takeLatest, all, fork, call, put, select} from 'redux-saga/effects';

import {Actions as CommonActions} from '../common/actions';
import {ActionWithPayload} from '../types';
import {Actions} from './actions';
import {ActionType} from './types';
import * as api from '../../apis';
import {Contract, ContractList, PagedData, PageParam, RequestAction, SearchForm, SearchParam} from '../../models';
import {RootState} from '../reducers';

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
    const res: PagedData<Contract[]> = yield call(api.contract.getContractList, action.payload);
    yield put(Actions.loadContractSearchListSuccess(res.content));
  } catch (error) {
    yield put(CommonActions.error(error));
  }
}

//合同列表
function* loadContractList(action: ActionWithPayload<ActionType, SearchParam>) {
  const params = action.payload;
  try {
    const {action, ...param} = params;
    yield put(Actions.loadContractLoading());
    const res: PagedData<ContractList[]> = yield call(api.contract.getMyContractList, param);
    //根据是否有数据返回来判断是不是最后一页，方式pageIndex一直增加
    console.log(111);
    if (!res?.content?.length) {
      const page: PageParam = yield select((state: RootState) => state.contract.contractList.page);
      res.page = page;
    }

    if (action === RequestAction.load) {
      const merchant: ContractList[] = yield select((state: RootState) => state?.contract?.contractList?.content);
      res.content = [...merchant, ...res?.content];
    }

    yield put(Actions.loadContractListSuccess(res));
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
