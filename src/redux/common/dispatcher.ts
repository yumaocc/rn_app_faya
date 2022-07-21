import {Dispatch} from 'redux';
import {Actions} from './actions';

import {PreviewConfig} from '../../models';

export interface CommonDispatcher {
  error(message: string): void;
  success(message: string): void;
  initApp(): void;
  previewImages(config: PreviewConfig): void;
  closePreview(): void;
}

export const getCommonDispatcher = (dispatch: Dispatch): CommonDispatcher => ({
  error(message: string) {
    dispatch(Actions.error(message));
  },
  success(message) {
    dispatch(Actions.success(message));
  },
  initApp() {
    dispatch(Actions.initApp());
  },
  previewImages(config: PreviewConfig) {
    dispatch(Actions.previewImages(config));
  },
  closePreview() {
    dispatch(Actions.closePreview());
  },
});
