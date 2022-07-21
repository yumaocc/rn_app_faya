import {Dispatch} from 'redux';

import {Actions} from './actions';
import {SearchParam} from '../../models';

export interface MerchantDispatcher {
  loadMerchantCategories(): void;
  loadCurrentMerchant(payload: number): void;
  loadMerchantSearchList(payload: SearchParam): void;
}

export const getMerchantDispatcher = (
  dispatch: Dispatch,
): MerchantDispatcher => {
  return {
    loadMerchantCategories() {
      dispatch(Actions.loadMerchantCategories());
    },
    loadCurrentMerchant(payload: number) {
      dispatch(Actions.loadCurrentMerchant(payload));
    },
    loadMerchantSearchList(payload: SearchParam) {
      dispatch(Actions.loadMerchantSearchList(payload));
    },
  };
};
