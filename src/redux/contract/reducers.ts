import produce from 'immer';

import {ContractActions} from './actions';
import {ActionType} from './types';
import {Contract, ContractList, PagedData} from '../../models';
import {PAGE_SIZE} from '../../constants';

export interface ContractState {
  currentContract?: Contract;
  loadingCurrentContract: boolean;
  contractSearchList: ContractList[];
  contractList?: PagedData<ContractList[]>;
  contractLoading: boolean;
}

export const initialState: ContractState = {
  loadingCurrentContract: false,
  contractSearchList: [],
  contractLoading: false,
  contractList: {
    content: [],
    page: {
      pageIndex: 1,
      pageSize: PAGE_SIZE,
      pageTotal: 0,
    },
  },
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
    case ActionType.LOAD_CONTRACT_LIST_SUCCESS:
      return produce(state, draft => {
        draft.contractLoading = false;
        draft.contractList = action.payload;
      });
    case ActionType.LOAD_CONTRACT_LOADING:
      return produce(state, draft => {
        draft.contractLoading = true;
      });
    default:
      return state;
  }
};
