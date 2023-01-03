import {ActionsUnion, ActionWithPayload, createAction, Action} from '../types';
import {ActionType} from './types';
import {Contract, ContractList, PagedData, SearchParam} from '../../models';

export const Actions = {
  loadCurrentContract: (payload: number): ActionWithPayload<ActionType.LOAD_CURRENT_CONTRACT, number> => createAction(ActionType.LOAD_CURRENT_CONTRACT, payload),
  loadCurrentContractSuccess: (payload: Contract): ActionWithPayload<ActionType.LOAD_CURRENT_CONTRACT_SUCCESS, Contract> =>
    createAction(ActionType.LOAD_CURRENT_CONTRACT_SUCCESS, payload),
  loadContractSearchList: (payload: SearchParam): ActionWithPayload<ActionType.LOAD_CONTRACT_SEARCH_LIST, SearchParam> =>
    createAction(ActionType.LOAD_CONTRACT_SEARCH_LIST, payload),
  loadContractSearchListSuccess: (payload: ContractList[]): ActionWithPayload<ActionType.LOAD_CONTRACT_SEARCH_LIST_SUCCESS, ContractList[]> =>
    createAction(ActionType.LOAD_CONTRACT_SEARCH_LIST_SUCCESS, payload),
  loadContractList: (payload: SearchParam): ActionWithPayload<ActionType.LOAD_CONTRACT_LIST, SearchParam> => createAction(ActionType.LOAD_CONTRACT_LIST, payload),
  loadContractListSuccess: (payload: PagedData<ContractList[]>): ActionWithPayload<ActionType.LOAD_CONTRACT_LIST_SUCCESS, PagedData<ContractList[]>> =>
    createAction(ActionType.LOAD_CONTRACT_LIST_SUCCESS, payload),
  loadContractLoading: (): Action<ActionType.LOAD_CONTRACT_LOADING> => createAction(ActionType.LOAD_CONTRACT_LOADING),
  endEdit: (): Action<ActionType.END_EDIT> => createAction(ActionType.END_EDIT),
};

export type ContractActions = ActionsUnion<typeof Actions>;
