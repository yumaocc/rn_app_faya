import {StyleProp, TextStyle, ViewStyle} from 'react-native';
import {Control, ControllerProps, FieldErrorsImpl, FieldValues, Path, UseFormSetValue, UseFormWatch} from 'react-hook-form';
export type OSType = 'ios' | 'android' | 'windows' | 'macos' | 'N/A';

export type PlatformType = 'WXMP' | 'WX' | 'DYMP' | 'APP' | 'WEB' | 'H5' | 'DESKTOP' | 'N/A';

export interface AppHeader {
  version?: string;
  platform?: PlatformType;
  os?: string;
  project?: 'FAYABD' | 'FAYAOA' | 'FAYABIZ' | 'FAYA' | string;
  token?: string;
}

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

export interface FileWithURL {
  url: string;
  uid?: string;
}

//时间搜索的参数
export interface BeginTimeAndEndTime {
  beginTime: string;
  endTime: string;
}

//时间选择类型
export interface Picker {
  value: TimeDimension;
  label: string;
}
//城市三级分类

export interface Site {
  id: number;
  name: string;
  children: Site[];
}

export interface City {
  value: number;
  label: string;
  children?: City[];
}

/// react-hook-form类型别名
// C代表组件
export type FormControlC = <TFieldValues extends FieldValues = FieldValues, TName extends Path<TFieldValues> = Path<TFieldValues>>(
  props: ControllerProps<TFieldValues, TName>,
) => import('react').ReactElement<any, string | import('react').JSXElementConstructor<any>>;
//表单控制器
export type FormControl = Control<FieldValues, any>;
//表单监听
export type FormWatch = UseFormWatch<FieldValues>;
//表单错误信息
export type FormErrors = Partial<
  FieldErrorsImpl<{
    [x: string]: any;
  }>
>;

//表单设置属性
export type FormSetValue = UseFormSetValue<FieldValues>;
