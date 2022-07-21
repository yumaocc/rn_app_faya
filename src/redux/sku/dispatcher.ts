import {Dispatch} from 'redux';

import {Actions} from './actions';

export interface SKUDispatcher {
  loadCodeType(): void;
  loadSKUCategory(): void;
  loadSKUBuyNotice(): void;
  loadCurrentSPU(spuId: number): void;
  endEditing(): void;
}

export const getSKUDispatcher = (dispatch: Dispatch): SKUDispatcher => ({
  loadCodeType: () => dispatch(Actions.loadCodeType()),
  loadSKUCategory: () => dispatch(Actions.loadSKUCategory()),
  loadSKUBuyNotice: () => dispatch(Actions.loadSKUBuyNotice()),
  loadCurrentSPU: (spuId: number) => dispatch(Actions.loadCurrentSPU(spuId)),
  endEditing: () => dispatch(Actions.endEditing()),
});
