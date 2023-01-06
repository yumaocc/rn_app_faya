import {Dispatch} from 'redux';

import {Actions} from './actions';
import {DateTimeRange} from '../../models';

export interface SummaryDispatcher {
  loadHome(): void;
  loadCommissionToday(): void;
  loadCommissionExpect(): void;
  loadCommissionTop(dateTimeRange: DateTimeRange): void;
  loadSalesTop(dateTimeRange: DateTimeRange): void;
  loadCommissionHistory(): void;
  endEdit(): void;
}

export const getSummaryDispatcher = (dispatch: Dispatch): SummaryDispatcher => ({
  loadHome: () => dispatch(Actions.loadHome()),
  loadCommissionToday: () => dispatch(Actions.loadCommissionToday()),
  loadCommissionExpect: () => dispatch(Actions.loadCommissionExpect()),
  loadCommissionTop: (dateTimeRange: DateTimeRange) => dispatch(Actions.loadCommissionTop(dateTimeRange)),
  loadSalesTop: (dateTimeRange: DateTimeRange) => dispatch(Actions.loadSalesTop(dateTimeRange)),
  loadCommissionHistory: () => dispatch(Actions.loadCommissionHistory()),
  endEdit: () => dispatch(Actions.endEdit()),
});
