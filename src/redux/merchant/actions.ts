import {ActionsUnion, createAction, Action, ActionWithPayload} from '../types';
import {ActionType} from './types';
import {MerchantCategory, FormMerchant, MerchantSimpleF, SearchParam, MerchantF, PagedData} from '../../models';

export const Actions = {
  loadMerchantLoading: (): Action<ActionType.LOAD_MERCHANT_LOADING> => createAction(ActionType.LOAD_MERCHANT_LOADING),
  loadMerchantCategories: (): Action<ActionType.LOAD_MERCHANT_CATEGORIES> => createAction(ActionType.LOAD_MERCHANT_CATEGORIES),
  loadMerchantCategoriesSuccess: (payload: MerchantCategory[]): ActionWithPayload<ActionType.LOAD_MERCHANT_CATEGORIES_SUCCESS, MerchantCategory[]> =>
    createAction(ActionType.LOAD_MERCHANT_CATEGORIES_SUCCESS, payload),
  loadCurrentMerchantPrivate: (payload: number): ActionWithPayload<ActionType.LOAD_CURRENT_MERCHANT_PRIVATE, number> =>
    createAction(ActionType.LOAD_CURRENT_MERCHANT_PRIVATE, payload),
  loadCurrentMerchantPrivateSuccess: (payload: FormMerchant): ActionWithPayload<ActionType.LOAD_CURRENT_MERCHANT_PRIVATE_SUCCESS, FormMerchant> =>
    createAction(ActionType.LOAD_CURRENT_MERCHANT_PRIVATE_SUCCESS, payload),
  loadCurrentMerchantPublic: (payload: number): ActionWithPayload<ActionType.LOAD_CURRENT_MERCHANT_PRIVATE, number> =>
    createAction(ActionType.LOAD_CURRENT_MERCHANT_PRIVATE, payload),
  loadCurrentMerchantPublicSuccess: (payload: FormMerchant): ActionWithPayload<ActionType.LOAD_CURRENT_MERCHANT_PRIVATE_SUCCESS, FormMerchant> =>
    createAction(ActionType.LOAD_CURRENT_MERCHANT_PRIVATE_SUCCESS, payload),
  loadMerchantSearchList: (payload: SearchParam): ActionWithPayload<ActionType.LOAD_MERCHANT_SEARCH_LIST, SearchParam> =>
    createAction(ActionType.LOAD_MERCHANT_SEARCH_LIST, payload),
  loadMerchantSearchListSuccess: (payload: MerchantSimpleF[]): ActionWithPayload<ActionType.LOAD_MERCHANT_SEARCH_LIST_SUCCESS, MerchantSimpleF[]> =>
    createAction(ActionType.LOAD_MERCHANT_SEARCH_LIST_SUCCESS, payload),
  endEdit: (): Action<ActionType.END_EDIT> => createAction(ActionType.END_EDIT),

  loadPublicMerchantList: (payload: SearchParam): ActionWithPayload<ActionType.LOAD_MERCHANT_PUBLIC_LIST, SearchParam> =>
    createAction(ActionType.LOAD_MERCHANT_PUBLIC_LIST, payload),
  loadPublicMerchantListSuccess: (payload: PagedData<MerchantF[]>): ActionWithPayload<ActionType.LOAD_MERCHANT_PUBLIC_LIST_SUCCESS, PagedData<MerchantF[]>> =>
    createAction(ActionType.LOAD_MERCHANT_PUBLIC_LIST_SUCCESS, payload),
  // setPublicMerchantLoadList: (payLoad: PagedData<MerchantF[]>): ActionWithPayload<ActionType.SET_MERCHANT_PRIVATE_LOAD_LIST, PagedData<MerchantF[]>> =>
  //   createAction(ActionType.SET_MERCHANT_PRIVATE_LOAD_LIST, payLoad),

  // setPrivateMerchantList: (payload: PagedData<MerchantF[]>): ActionWithPayload<ActionType.SET_MERCHANT_PRIVATE_LIST, PagedData<MerchantF[]>> =>
  //   createAction(ActionType.SET_MERCHANT_PRIVATE_LIST, payload),
  // setMeMerchantList: (payload: MyMerchantF[]): ActionWithPayload<ActionType.SET_MERCHANT_ME_LIST, MyMerchantF[]> => createAction(ActionType.SET_MERCHANT_ME_LIST, payload),
};
export type MerchantActions = ActionsUnion<typeof Actions>;
