import produce from 'immer';

import {ContractActions} from './actions';
import {ActionType} from './types';
import {ContractDetailF, ContractF} from '../../models';

export interface ContractState {
  currentContract?: ContractDetailF;
  loadingCurrentContract: boolean;
  contractSearchList: ContractF[];
}

export const initialState: ContractState = {
  loadingCurrentContract: false,
  contractSearchList: [],
};

export default (state = initialState, action: ContractActions): ContractState => {
  switch (action.type) {
    case ActionType.LOAD_CURRENT_CONTRACT:
      return produce(state, draft => {
        draft.loadingCurrentContract = true;
      });
    case ActionType.LOAD_CURRENT_CONTRACT_SUCCESS:
      return produce(state, draft => {
        draft.loadingCurrentContract = false;
        draft.currentContract = action.payload;
      });
    case ActionType.LOAD_CONTRACT_SEARCH_LIST_SUCCESS:
      return produce(state, draft => {
        draft.contractSearchList = action.payload;
      });
    case ActionType.END_EDIT:
      return produce(state, draft => {
        draft.currentContract = undefined;
        draft.contractSearchList = [];
      });
    default:
      return state;
  }
};
