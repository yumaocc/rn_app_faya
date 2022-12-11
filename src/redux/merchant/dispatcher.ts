import {Dispatch} from 'redux';

import {Actions} from './actions';
import {SearchParam} from '../../models';

export interface MerchantDispatcher {
  loadMerchantCategories(): void;
  loadCurrentMerchantPrivate(payload: number): void;
  loadCurrentMerchantPublic(payload: number): void;
  loadMerchantSearchList(payload: SearchParam): void;
  exitMerchantPage(): void;
}

export const getMerchantDispatcher = (dispatch: Dispatch): MerchantDispatcher => {
  return {
    loadMerchantCategories() {
      dispatch(Actions.loadMerchantCategories());
    },
    loadCurrentMerchantPrivate(payload: number) {
      dispatch(Actions.loadCurrentMerchantPrivate(payload));
    },
    loadCurrentMerchantPublic(payload: number) {
      dispatch(Actions.loadCurrentMerchantPrivate(payload));
    },
    loadMerchantSearchList(payload: SearchParam) {
      dispatch(Actions.loadMerchantSearchList(payload));
    },
    exitMerchantPage() {
      dispatch(Actions.endEdit());
    },
  };
};
