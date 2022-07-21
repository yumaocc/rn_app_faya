import produce from 'immer';

import {SKUActions} from './actions';
import {ActionType} from './types';
import {SPUCodeType, SPUCategory, SKUBuyNotice, SPUDetailF} from '../../models';

export interface SKUState {
  codeTypes: SPUCodeType[];
  categories: SPUCategory[];
  buyNotice?: SKUBuyNotice;
  currentSPU?: SPUDetailF;
}

// BOOKING 预约须知，SALE_TIME售卖、营业时间，USE_RULE使用规则，TIPS温馨提示，POLICY取消政策
export const initialState: SKUState = {
  codeTypes: [],
  categories: [],
};
export default (state = initialState, action: SKUActions): SKUState => {
  switch (action.type) {
    case ActionType.LOAD_CODE_TYPE_SUCCESS:
      return produce(state, draft => {
        draft.codeTypes = action.payload;
      });
    case ActionType.LOAD_SKU_CATEGORY_SUCCESS:
      return produce(state, draft => {
        draft.categories = action.payload;
      });
    case ActionType.LOAD_SKU_BUY_NOTICE_SUCCESS:
      return produce(state, draft => {
        draft.buyNotice = action.payload;
      });
    case ActionType.LOAD_CURRENT_SPU_SUCCESS:
      return produce(state, draft => {
        draft.currentSPU = action.payload;
      });
    case ActionType.END_EDITING:
      return produce(state, draft => {
        draft.currentSPU = undefined;
      });
    default:
      return state;
  }
};
