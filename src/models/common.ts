import {StyleProp, TextStyle, ViewStyle} from 'react-native';

export class CustomError extends Error {
  constructor(message: string, public code: number = 1) {
    super(message);
    this.code = code;
    this.message = message;
  }
}

export class CustomErrorWithPayload extends Error {
  constructor(message: string, public code: number = 1, public payload: any) {
    super(message);
    this.code = code;
    this.message = message;
    this.payload = payload;
  }
}

export type ErrorType = CustomError | CustomErrorWithPayload | Error;

export type CacheKeys = 'token' | 'api' | 'phone' | 'useMockData';

export interface PageParam {
  pageIndex?: number;
  pageSize?: number;
}

export interface PreviewConfig {
  images?: string[];
  currentIndex?: number;
  show?: boolean;
}

// 用来表示各种表格页面的搜索参数
export interface SearchForm {
  [key: string]: any;
}

export type SearchParam = PageParam & SearchForm;

export type SubmitState = 'none' | 'loading' | 'success' | 'error';

/**
 * 后端常使用0和1表示boolean类型
 */
export enum BoolEnum {
  TRUE = 1,
  FALSE = 0,
}

export type TimeDimension = 'day' | 'week' | 'month' | 'year';

export type DateTimeRange = [DateTimeString, DateTimeString];

export type Environment = 'development' | 'production';

// 后端经常用0和1代表bool
export type BoolNumber = 0 | 1;

// 形如2020-01-01 00:00:00的时间格式
export type DateTimeString = string;

// 形如2020-01-01的日期格式
export type DateString = string;

export type StylePropText = StyleProp<TextStyle>;
export type StylePropView = StyleProp<ViewStyle>;
