import {Dispatch} from 'redux';

import {Actions} from './actions';
import {SearchParam} from '../../models';

export interface MerchantDispatcher {
  loadMerchantCategories(): void;
  loadCurrentMerchantPrivate(payload: number): void;
  loadCurrentMerchantPublic(payload: number): void;
  loadMerchantSearchList(payload: SearchParam): void;

  loadPublicMerchantList(payload: SearchParam): void;
  loadPrivateMerchantList(payload: SearchParam): void;

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
      dispatch(Actions.loadCurrentMerchantPublic(payload));
    },
    loadMerchantSearchList(payload: SearchParam) {
      dispatch(Actions.loadMerchantSearchList(payload));
    },
    exitMerchantPage() {
      dispatch(Actions.endEdit());
    },

    loadPublicMerchantList(payload: SearchParam) {
      dispatch(Actions.loadPublicMerchantList(payload));
    },
    loadPrivateMerchantList(payload: SearchParam) {
      dispatch(Actions.loadPrivateMerchantList(payload));
    },
  };
};
