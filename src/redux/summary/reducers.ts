import produce from 'immer';
import {SummaryActions} from './actions';
import {ActionType} from './types';
import {CommissionExpect, CommissionHistory, CommissionToday, CommissionTop, HomeStatisticsF, SaleTop} from '../../models';

export interface SummaryState {
  home?: HomeStatisticsF;
  commissionToday?: CommissionToday;
  commissionExpect?: CommissionExpect;
  commissionTop?: CommissionTop;
  saleTop?: SaleTop;
  commissionHistory?: CommissionHistory;
}

export const initialState: SummaryState = {};

export default (state = initialState, action: SummaryActions): SummaryState => {
  const {type} = action;

  switch (type) {
    case ActionType.LOAD_HOME_SUCCESS:
      return produce(state, draft => {
        const {payload} = action;
        draft.home = payload;
      });
    case ActionType.LOAD_COMMISSION_TODAY_SUCCESS:
      return produce(state, draft => {
        const {payload} = action;
        draft.commissionToday = payload;
      });
    case ActionType.LOAD_COMMISSION_EXPECT_SUCCESS:
      return produce(state, draft => {
        const {payload} = action;
        draft.commissionExpect = payload;
      });
    case ActionType.LOAD_SPU_COMMISSION_TOP_SUCCESS:
      return produce(state, draft => {
        const {payload} = action;
        draft.commissionTop = payload;
      });
    case ActionType.LOAD_SPU_SALES_TOP_SUCCESS:
      return produce(state, draft => {
        const {payload} = action;
        draft.saleTop = payload;
      });
    case ActionType.LOAD_COMMISSION_HISTORY_SUCCESS:
      return produce(state, draft => {
        const {payload} = action;
        draft.commissionHistory = payload;
      });
    default:
      return state;
  }
};
