import {ActionsUnion, ActionWithPayload, createAction, Action} from '../types';
import {ActionType} from './types';
import {
  MerchantCategory,
  MerchantDetailF,
  MerchantSimpleF,
  SearchParam,
} from '../../models';

export const Actions = {
  loadMerchantCategories: (): Action<ActionType.LOAD_MERCHANT_CATEGORIES> =>
    createAction(ActionType.LOAD_MERCHANT_CATEGORIES),
  loadMerchantCategoriesSuccess: (
    payload: MerchantCategory[],
  ): ActionWithPayload<
    ActionType.LOAD_MERCHANT_CATEGORIES_SUCCESS,
    MerchantCategory[]
  > => createAction(ActionType.LOAD_MERCHANT_CATEGORIES_SUCCESS, payload),
  loadCurrentMerchant: (
    payload: number,
  ): ActionWithPayload<ActionType.LOAD_CURRENT_MERCHANT, number> =>
    createAction(ActionType.LOAD_CURRENT_MERCHANT, payload),
  loadCurrentMerchantSuccess: (
    payload: MerchantDetailF,
  ): ActionWithPayload<
    ActionType.LOAD_CURRENT_MERCHANT_SUCCESS,
    MerchantDetailF
  > => createAction(ActionType.LOAD_CURRENT_MERCHANT_SUCCESS, payload),
  loadMerchantSearchList: (
    payload: SearchParam,
  ): ActionWithPayload<ActionType.LOAD_MERCHANT_SEARCH_LIST, SearchParam> =>
    createAction(ActionType.LOAD_MERCHANT_SEARCH_LIST, payload),
  loadMerchantSearchListSuccess: (
    payload: MerchantSimpleF[],
  ): ActionWithPayload<
    ActionType.LOAD_MERCHANT_SEARCH_LIST_SUCCESS,
    MerchantSimpleF[]
  > => createAction(ActionType.LOAD_MERCHANT_SEARCH_LIST_SUCCESS, payload),
  endEdit: (): Action<ActionType.END_EDIT> => createAction(ActionType.END_EDIT),
};
export type MerchantActions = ActionsUnion<typeof Actions>;
