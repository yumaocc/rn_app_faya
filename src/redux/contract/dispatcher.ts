import {Dispatch} from 'redux';

import {Actions} from './actions';
import {SearchParam} from '../../models';

export interface ContractDispatcher {
  loadCurrentContract(payload: number): void;
  loadContractSearchList(payload: SearchParam): void;
  loadContractList(payload: SearchParam): void;
  endEdit(): void;
  logout(): void;
}
export const getContractDispatcher = (dispatch: Dispatch): ContractDispatcher => ({
  loadCurrentContract: (payload: number) => dispatch(Actions.loadCurrentContract(payload)),
  loadContractSearchList: (payload: SearchParam) => dispatch(Actions.loadContractSearchList(payload)),
  loadContractList: (payload: SearchParam) => dispatch(Actions.loadContractList(payload)),
  endEdit: () => dispatch(Actions.endEdit()),
  logout: () => dispatch(Actions.logout()),
});
