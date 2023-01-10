import produce from 'immer';

import {ContractActions} from './actions';
import {ActionType} from './types';
import {Contract, ContractList} from '../../models';
import {MerchantList} from '../../models/merchant';

export interface ContractState {
  currentContract?: Contract;
  loadingCurrentContract: boolean;
  contractSearchList: ContractList[];
  contractList?: MerchantList<ContractList[]>;
  contractLoading: boolean;
}

export const initialState: ContractState = {
  loadingCurrentContract: false,
  contractSearchList: [],
  contractLoading: false,
  contractList: {
    content: [],
    status: 'none',
    page: {
      pageIndex: 1,
      pageSize: 10,
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
    case ActionType.CHANGE_LOADING_STATE:
      return produce(state, draft => {
        draft.contractList.status = 'loading';
      });
    case ActionType.LOGOUT: //这里比较特殊，首页也需要合同数据，所以不能在退出页面的清空数据，而且其他地方导致合同变化，我都会刷新数据，所以合同数据现在只退出的时候清空
      return produce(state, draft => {
        draft.contractList.content = [];
        draft.contractList.status = 'none';
        draft.contractList.page = {pageTotal: 0, pageIndex: 1, pageSize: 0};
      });
    default:
      return state;
  }
};
