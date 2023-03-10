import {Dispatch} from 'redux';
import {Actions} from './actions';

import {PreviewConfig} from '../../models';

export interface CommonDispatcher {
  error(message: string | any): void;
  success(message: string): void;
  info(message: string): void;
  initApp(): void;
  previewImages(config: PreviewConfig): void;
  closePreview(): void;
  setToken(token: string): void;
  loadAllSite(): void;
  loadCity(): void;
}

export const getCommonDispatcher = (dispatch: Dispatch): CommonDispatcher => ({
  error(message: string | any) {
    dispatch(Actions.error(message));
  },
  success(message) {
    dispatch(Actions.success(message));
  },
  info(message) {
    dispatch(Actions.info(message));
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
  setToken(token) {
    dispatch(Actions.setToken(token));
  },
  loadAllSite() {
    dispatch(Actions.loadAllSites());
  },
  loadCity() {
    dispatch(Actions.loadCity());
  },
});
