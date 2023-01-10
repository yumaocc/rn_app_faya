import {ActionsUnion, ActionWithPayload, createAction, Action} from '../types';
import {ActionType} from './types';
import {Contract, ContractList, SearchParam} from '../../models';
import {MerchantList} from '../../models/merchant';

export const Actions = {
  loadCurrentContract: (payload: number): ActionWithPayload<ActionType.LOAD_CURRENT_CONTRACT, number> => createAction(ActionType.LOAD_CURRENT_CONTRACT, payload),
  loadCurrentContractSuccess: (payload: Contract): ActionWithPayload<ActionType.LOAD_CURRENT_CONTRACT_SUCCESS, Contract> =>
    createAction(ActionType.LOAD_CURRENT_CONTRACT_SUCCESS, payload),
  loadContractSearchList: (payload: SearchParam): ActionWithPayload<ActionType.LOAD_CONTRACT_SEARCH_LIST, SearchParam> =>
    createAction(ActionType.LOAD_CONTRACT_SEARCH_LIST, payload),
  loadContractSearchListSuccess: (payload: ContractList[]): ActionWithPayload<ActionType.LOAD_CONTRACT_SEARCH_LIST_SUCCESS, ContractList[]> =>
    createAction(ActionType.LOAD_CONTRACT_SEARCH_LIST_SUCCESS, payload),
  loadContractList: (payload: SearchParam): ActionWithPayload<ActionType.LOAD_CONTRACT_LIST, SearchParam> => createAction(ActionType.LOAD_CONTRACT_LIST, payload),
  loadContractListSuccess: (payload: MerchantList<ContractList[]>): ActionWithPayload<ActionType.LOAD_CONTRACT_LIST_SUCCESS, MerchantList<ContractList[]>> =>
    createAction(ActionType.LOAD_CONTRACT_LIST_SUCCESS, payload),
  changeLoadingState: (): Action<ActionType.CHANGE_LOADING_STATE> => createAction(ActionType.CHANGE_LOADING_STATE),
  loadContractLoading: (): Action<ActionType.LOAD_CONTRACT_LOADING> => createAction(ActionType.LOAD_CONTRACT_LOADING),
  endEdit: (): Action<ActionType.END_EDIT> => createAction(ActionType.END_EDIT),
  logout: (): Action<ActionType.LOGOUT> => createAction(ActionType.LOGOUT),
};

export type ContractActions = ActionsUnion<typeof Actions>;
