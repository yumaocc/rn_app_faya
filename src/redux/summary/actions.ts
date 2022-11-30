import {ActionsUnion, ActionWithPayload, createAction, Action} from '../types';
import {ActionType} from './types';
import {HomeStatisticsF, CommissionToday, CommissionExpect, DateTimeRange, CommissionTop, SaleTop, CommissionHistory} from '../../models';

export const Actions = {
  loadHome: (): Action<ActionType.LOAD_HOME> => createAction(ActionType.LOAD_HOME),
  loadHomeSuccess: (payload: HomeStatisticsF): ActionWithPayload<ActionType.LOAD_HOME_SUCCESS, HomeStatisticsF> => createAction(ActionType.LOAD_HOME_SUCCESS, payload),
  loadCommissionToday: (): Action<ActionType.LOAD_COMMISSION_TODAY> => createAction(ActionType.LOAD_COMMISSION_TODAY),
  loadCommissionTodaySuccess: (payload: CommissionToday): ActionWithPayload<ActionType.LOAD_COMMISSION_TODAY_SUCCESS, CommissionToday> =>
    createAction(ActionType.LOAD_COMMISSION_TODAY_SUCCESS, payload),
  loadCommissionExpect: (): Action<ActionType.LOAD_COMMISSION_EXPECT> => createAction(ActionType.LOAD_COMMISSION_EXPECT),
  loadCommissionExpectSuccess: (payload: CommissionExpect): ActionWithPayload<ActionType.LOAD_COMMISSION_EXPECT_SUCCESS, CommissionExpect> =>
    createAction(ActionType.LOAD_COMMISSION_EXPECT_SUCCESS, payload),
  loadCommissionTop: (payload: DateTimeRange): ActionWithPayload<ActionType.LOAD_SPU_COMMISSION_TOP, DateTimeRange> => createAction(ActionType.LOAD_SPU_COMMISSION_TOP, payload),
  loadCommissionTopSuccess: (payload: CommissionTop): ActionWithPayload<ActionType.LOAD_SPU_COMMISSION_TOP_SUCCESS, CommissionTop> =>
    createAction(ActionType.LOAD_SPU_COMMISSION_TOP_SUCCESS, payload),
  loadSalesTop: (payload: DateTimeRange): ActionWithPayload<ActionType.LOAD_SPU_SALES_TOP, DateTimeRange> => createAction(ActionType.LOAD_SPU_SALES_TOP, payload),
  loadSalesTopSuccess: (payload: SaleTop): ActionWithPayload<ActionType.LOAD_SPU_SALES_TOP_SUCCESS, SaleTop> => createAction(ActionType.LOAD_SPU_SALES_TOP_SUCCESS, payload),
  loadCommissionHistory: (): Action<ActionType.LOAD_COMMISSION_HISTORY> => createAction(ActionType.LOAD_COMMISSION_HISTORY),
  loadCommissionHistorySuccess: (payload: CommissionHistory): ActionWithPayload<ActionType.LOAD_COMMISSION_HISTORY_SUCCESS, CommissionHistory> =>
    createAction(ActionType.LOAD_COMMISSION_HISTORY_SUCCESS, payload),
};

export type SummaryActions = ActionsUnion<typeof Actions>;
