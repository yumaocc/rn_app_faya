import {combineReducers} from 'redux';
import common, {CommonState} from './common/reducers';
import contract, {ContractState} from './contract/reducers';
import merchant, {MerchantState} from './merchant/reducers';
import sku, {SKUState} from './sku/reducers';
import summary, {SummaryState} from './summary/reducers';
import user, {UserState} from './user/reducers';

export interface RootState {
  readonly user: UserState;
  readonly common: CommonState;
  readonly merchant: MerchantState;
  readonly sku: SKUState;
  readonly contract: ContractState;
  readonly summary: SummaryState;
}

export default combineReducers<RootState>({
  user,
  common,
  merchant,
  sku,
  contract,
  summary,
});
