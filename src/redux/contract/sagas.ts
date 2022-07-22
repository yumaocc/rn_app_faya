import isNil from 'lodash/isNil';
import {takeLatest, all, fork, call, put} from 'redux-saga/effects';

import {Actions as CommonActions} from '../common/actions';
import {ActionWithPayload} from '../types';
import {Actions} from './actions';
import {ActionType} from './types';
import * as api from '../../apis';
import {ContractDetailF} from '../../models';

function* loadCurrentContract(
  action: ActionWithPayload<ActionType.LOAD_CURRENT_CONTRACT, number>,
): any {
  const contractId = action.payload;
  if (isNil(contractId)) {
    return yield put(Actions.loadCurrentContractSuccess(undefined as any));
  }
  try {
    const res: ContractDetailF = yield call(
      api.contract.getContractDetail,
      contractId,
    );
    yield put(Actions.loadCurrentContractSuccess(res));
  } catch (error) {
    yield put(CommonActions.error(error));
  }
}

export function* watchContractSagas() {
  yield takeLatest(ActionType.LOAD_CURRENT_CONTRACT, loadCurrentContract);
}

export default function* contractSagas() {
  yield all([fork(watchContractSagas)]);
}
