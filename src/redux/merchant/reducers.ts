import produce from 'immer';
import {MerchantActions} from './actions';
import {ActionType} from './types';
import {MerchantCategory, FormMerchant, MerchantSimpleF, MerchantF, ListLoadingType} from '../../models';
import {MerchantList} from '../../models/merchant';

export interface MerchantState {
  merchantCategories: MerchantCategory[];
  loadingCurrentMerchant: boolean;
  currentMerchant?: FormMerchant;
  merchantSearchList: MerchantSimpleF[];
  merchantPublicList?: MerchantList<MerchantF[]>;
  merchantPrivateList?: MerchantList<MerchantF[]>;
  merchantLoading: boolean;
  merchantPublicLoading?: ListLoadingType;
  merchantPrivateLoading?: ListLoadingType;
}

export const initialState: MerchantState = {
  merchantCategories: [],
  loadingCurrentMerchant: false,
  merchantLoading: false,
  merchantSearchList: [],
  merchantPublicList: {
    content: [],
    status: 'none',
    page: {},
  },
  merchantPublicLoading: {
    pullDownLoading: false,
    pullUpLoading: false,
    searchLoading: false,
  },
  merchantPrivateLoading: {
    pullDownLoading: false,
    pullUpLoading: false,
    searchLoading: false,
  },
  merchantPrivateList: {
    content: [],
    status: 'none',
    page: {},
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
        draft.merchantPublicLoading = {
          pullDownLoading: false,
          pullUpLoading: false,
          searchLoading: false,
        };
        draft.merchantPublicList = action.payload;
      });
    case ActionType.MERCHANT_PUBLIC_LOADING:
      return produce(state, draft => {
        draft.merchantPublicLoading = action.payload;
      });
    case ActionType.CHANGE_MERCHANT_LOADING_STATE_PUBLIC:
      return produce(state, draft => {
        draft.merchantPublicList.status = 'loading';
      });

    case ActionType.LOAD_MERCHANT_PRIVATE_LIST_SUCCESS:
      return produce(state, draft => {
        draft.merchantPrivateLoading = {
          pullDownLoading: false,
          pullUpLoading: false,
          searchLoading: false,
        };
        draft.merchantPrivateList = action.payload;
      });
    case ActionType.MERCHANT_PRIVATE_LOADING:
      return produce(state, draft => {
        draft.merchantPrivateLoading = action.payload;
      });
    case ActionType.CHANGE_MERCHANT_LOADING_STATE_PRIVATE:
      return produce(state, draft => {
        draft.merchantPrivateList.status = 'loading';
      });

    case ActionType.LOAD_MERCHANT_LOADING:
      return produce(state, draft => {
        draft.merchantLoading = true;
      });
    case ActionType.LOGOUT:
      return produce(state, draft => {
        draft.merchantPublicList = {
          content: [],
          status: 'none',
          page: {
            pageIndex: 1,
            pageSize: 10,
            pageTotal: 0,
          },
        };
        draft.merchantPrivateList = {
          content: [],
          status: 'none',
          page: {
            pageIndex: 1,
            pageSize: 10,
            pageTotal: 0,
          },
        };
      });
    default:
      return state;
  }
};
