import {ActionWithPayload, Action, createAction, ActionsUnion} from '../types';
import {ActionType} from './types';
import {SKUBuyNoticeF, SPUCategory, SPUCodeType, SPUDetailF} from '../../models';

export const Actions = {
  loadCodeType: (): Action<ActionType.LOAD_CODE_TYPE> => createAction(ActionType.LOAD_CODE_TYPE),
  loadCodeTypeSuccess: (payload: SPUCodeType[]): ActionWithPayload<ActionType.LOAD_CODE_TYPE_SUCCESS, SPUCodeType[]> => createAction(ActionType.LOAD_CODE_TYPE_SUCCESS, payload),
  loadSKUCategory: (): Action<ActionType.LOAD_SKU_CATEGORY> => createAction(ActionType.LOAD_SKU_CATEGORY),
  loadSKUCategorySuccess: (payload: SPUCategory[]): ActionWithPayload<ActionType.LOAD_SKU_CATEGORY_SUCCESS, SPUCategory[]> =>
    createAction(ActionType.LOAD_SKU_CATEGORY_SUCCESS, payload),
  loadSKUBuyNotice: (): Action<ActionType.LOAD_SKU_BUY_NOTICE> => createAction(ActionType.LOAD_SKU_BUY_NOTICE),
  loadSKUBuyNoticeSuccess: (payload: SKUBuyNoticeF[]): ActionWithPayload<ActionType.LOAD_SKU_BUY_NOTICE_SUCCESS, SKUBuyNoticeF[]> =>
    createAction(ActionType.LOAD_SKU_BUY_NOTICE_SUCCESS, payload),
  loadCurrentSPU: (spuId: number): ActionWithPayload<ActionType.LOAD_CURRENT_SPU, number> => createAction(ActionType.LOAD_CURRENT_SPU, spuId),
  loadCurrentSPUSuccess: (payload: SPUDetailF): ActionWithPayload<ActionType.LOAD_CURRENT_SPU_SUCCESS, SPUDetailF> => createAction(ActionType.LOAD_CURRENT_SPU_SUCCESS, payload),
  endEditing: (): Action<ActionType.END_EDITING> => createAction(ActionType.END_EDITING),
};

export type SKUActions = ActionsUnion<typeof Actions>;
