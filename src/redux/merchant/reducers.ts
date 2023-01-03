import produce from 'immer';
import {MerchantActions} from './actions';
import {ActionType} from './types';
import {MerchantCategory, FormMerchant, MerchantSimpleF, MerchantF, PagedData} from '../../models';

export interface MerchantState {
  merchantCategories: MerchantCategory[];
  loadingCurrentMerchant: boolean;
  currentMerchant?: FormMerchant;
  merchantSearchList: MerchantSimpleF[];
  merchantPublicList?: PagedData<MerchantF[]>;
  merchantPrivateList: PagedData<MerchantF[]>;
  merchantLoading: boolean;
}

export const initialState: MerchantState = {
  merchantCategories: [],
  loadingCurrentMerchant: false,
  merchantLoading: false,
  merchantSearchList: [],
  merchantPublicList: {
    content: [],
    page: {
      pageIndex: 1,
      pageSize: 10,
      pageTotal: 0,
    },
  },
  merchantPrivateList: {
    content: [],
    page: {
      pageIndex: 1,
      pageSize: 10,
      pageTotal: 0,
    },
  },
};

export default (state = initialState, action: MerchantActions): MerchantState => {
  switch (action.type) {
    case ActionType.LOAD_MERCHANT_CATEGORIES_SUCCESS:
      return produce(state, draft => {
        draft.merchantCategories = action.payload;
      });
    case ActionType.LOAD_CURRENT_MERCHANT_PRIVATE:
      return produce(state, draft => {
        draft.loadingCurrentMerchant = true;
      });
    case ActionType.LOAD_CURRENT_MERCHANT_PRIVATE_SUCCESS:
      return produce(state, draft => {
        draft.loadingCurrentMerchant = false;
        draft.currentMerchant = action.payload;
      });
    case ActionType.LOAD_CURRENT_MERCHANT_PUBIC_SUCCESS:
      return produce(state, draft => {
        draft.loadingCurrentMerchant = false;
        draft.currentMerchant = action.payload;
      });
    case ActionType.LOAD_MERCHANT_SEARCH_LIST_SUCCESS:
      return produce(state, draft => {
        draft.merchantSearchList = action.payload;
      });
    case ActionType.END_EDIT:
      return produce(state, draft => {
        draft.currentMerchant = null;
        draft.merchantSearchList = [];
      });
    case ActionType.LOAD_MERCHANT_PUBLIC_LIST_SUCCESS:
      return produce(state, draft => {
        draft.merchantLoading = false;
        draft.merchantPublicList = action.payload;
      });
    case ActionType.LOAD_MERCHANT_PRIVATE_LIST_SUCCESS:
      return produce(state, draft => {
        draft.merchantLoading = false;
        draft.merchantPrivateList = action.payload;
      });
    case ActionType.LOAD_MERCHANT_LOADING:
      return produce(state, draft => {
        draft.merchantLoading = true;
      });
    default:
      return state;
  }
};
