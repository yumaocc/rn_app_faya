import produce from 'immer';
import {MerchantActions} from './actions';
import {ActionType} from './types';
import {MerchantCategory, FormMerchant, MerchantSimpleF} from '../../models';

export interface MerchantState {
  merchantCategories: MerchantCategory[];
  loadingCurrentMerchant: boolean;
  currentMerchant?: FormMerchant;
  merchantSearchList: MerchantSimpleF[];
}

export const initialState: MerchantState = {
  merchantCategories: [],
  loadingCurrentMerchant: false,
  merchantSearchList: [],
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
    case ActionType.LOAD_MERCHANT_SEARCH_LIST_SUCCESS:
      return produce(state, draft => {
        draft.merchantSearchList = action.payload;
      });
    case ActionType.END_EDIT:
      return produce(state, draft => {
        draft.currentMerchant = null;
        draft.merchantSearchList = [];
      });
    default:
      return state;
  }
};
