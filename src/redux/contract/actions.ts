import {ActionsUnion, ActionWithPayload, createAction, Action} from '../types';
import {ActionType} from './types';
import {ContractDetailF, ContractF, SearchParam} from '../../models';

export const Actions = {
  loadCurrentContract: (payload: number): ActionWithPayload<ActionType.LOAD_CURRENT_CONTRACT, number> => createAction(ActionType.LOAD_CURRENT_CONTRACT, payload),
  loadCurrentContractSuccess: (payload: ContractDetailF): ActionWithPayload<ActionType.LOAD_CURRENT_CONTRACT_SUCCESS, ContractDetailF> =>
    createAction(ActionType.LOAD_CURRENT_CONTRACT_SUCCESS, payload),
  loadContractSearchList: (payload: SearchParam): ActionWithPayload<ActionType.LOAD_CONTRACT_SEARCH_LIST, SearchParam> =>
    createAction(ActionType.LOAD_CONTRACT_SEARCH_LIST, payload),
  loadContractSearchListSuccess: (payload: ContractF[]): ActionWithPayload<ActionType.LOAD_CONTRACT_SEARCH_LIST_SUCCESS, ContractF[]> =>
    createAction(ActionType.LOAD_CONTRACT_SEARCH_LIST_SUCCESS, payload),
  endEdit: (): Action<ActionType.END_EDIT> => createAction(ActionType.END_EDIT),
};
export type ContractActions = ActionsUnion<typeof Actions>;
