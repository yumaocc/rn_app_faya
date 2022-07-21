import produce from 'immer';

import {CommonActions} from './actions';
import {ActionType} from './types';

export interface CommonState {
  appInited: boolean; // 应用是否初始化完成,初始化完成后才能做任何操作
  message: string; // 全局消息提示
  token?: string; // 登录token
  messageType: 'error' | 'success' | 'info' | 'none';
  preview: {
    images?: string[];
    currentIndex?: number;
    show: boolean;
  };
}

export const initialState: CommonState = {
  appInited: false,
  message: '',
  messageType: 'none',
  preview: {
    images: [],
    currentIndex: 0,
    show: false,
  },
};

export default (state = initialState, action: CommonActions): CommonState => {
  const {type} = action;

  switch (type) {
    case ActionType.INIT_APP_SUCCESS:
      return produce(state, draft => {
        draft.appInited = true;
      });
    case ActionType.ERROR:
      return produce(state, draft => {
        const {payload} = action;
        const isString = typeof payload === 'string';
        const message = isString ? payload : payload.message;
        draft.message = message || '';
        draft.messageType = 'error';
      });
    case ActionType.SUCCESS:
      return produce(state, draft => {
        const {payload} = action;
        draft.message = payload || '';
        draft.messageType = 'success';
      });
    case ActionType.INFO:
      return produce(state, draft => {
        const {payload} = action;
        draft.message = payload || '';
        draft.messageType = 'info';
      });
    case ActionType.DISMISS_MESSAGE:
      return produce(state, draft => {
        draft.message = '';
        draft.messageType = 'none';
      });
    case ActionType.PREVIEW_IMAGES:
      return produce(state, draft => {
        const {payload} = action;
        draft.preview = {
          images: payload.images || [],
          currentIndex: payload.currentIndex || 0,
          show: true,
        };
      });
    case ActionType.PREVIEW_END:
      return produce(state, draft => {
        draft.preview = {
          images: [],
          currentIndex: 0,
          show: false,
        };
      });
    case ActionType.SET_TOKEN:
      return produce(state, draft => {
        const {payload} = action;
        draft.token = payload;
      });
    default:
      return state;
  }
};
