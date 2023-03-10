import {Action, ActionsUnion, ActionWithPayload, createAction} from '../types';
import {ActionType} from './types';
import {ErrorType, PreviewConfig, Site} from '../../models';
import {City} from '../../models/common';

export const Actions = {
  initApp: (): Action<ActionType.INIT_APP> => createAction(ActionType.INIT_APP),
  initAppSuccess: (): Action<ActionType.INIT_APP_SUCCESS> => createAction(ActionType.INIT_APP_SUCCESS),
  error: (error: ErrorType | string | any): ActionWithPayload<ActionType.ERROR, ErrorType | string> => createAction(ActionType.ERROR, error),
  info: (message: string): ActionWithPayload<ActionType.INFO, string> => createAction(ActionType.INFO, message),
  success: (message: string): ActionWithPayload<ActionType.SUCCESS, string> => createAction(ActionType.SUCCESS, message),
  dismissMessage: (): Action<ActionType.DISMISS_MESSAGE> => createAction(ActionType.DISMISS_MESSAGE),
  previewImages: (config: PreviewConfig): ActionWithPayload<ActionType.PREVIEW_IMAGES, PreviewConfig> => {
    return createAction(ActionType.PREVIEW_IMAGES, config);
  },
  closePreview: (): Action<ActionType.PREVIEW_END> => {
    return createAction(ActionType.PREVIEW_END);
  },
  setToken: (token: string): ActionWithPayload<ActionType.SET_TOKEN, string> => createAction(ActionType.SET_TOKEN, token),
  loadAllSites: (): Action<ActionType.LOAD_AllSITE> => createAction(ActionType.LOAD_AllSITE),
  loadAllSitesSuccess: (payload: Site[]): ActionWithPayload<ActionType.LOAD_AllSITE_SUCCESS, Site[]> => createAction(ActionType.LOAD_AllSITE_SUCCESS, payload),
  loadCity: (): Action<ActionType.LOAD_CITY> => createAction(ActionType.LOAD_CITY),
  loadCitySuccess: (city: City[]): ActionWithPayload<ActionType.LOAD_CITY_SUCCESS, City[]> => createAction(ActionType.LOAD_CITY_SUCCESS, city),
};

export type CommonActions = ActionsUnion<typeof Actions>;
