import {BoolEnum} from '../models';

export const ERROR_SHOW_TIME = 3e3; // 错误提示框显示时间
export const REQUEST_TIMEOUT = 3 * 60 * 1e3; // 请求超时时间, 3分钟
export const DEFAULT_PAGE_SIZE = 10; // 默认分页大小
export const MOCK_API_DELAY = 500; // mock api延迟时间

// 时间处理相关
export const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss'; // 统一的时间格式
export const DEFAULT_START_DATE = '1970-01-01 00:00:00'; // 默认的开始时间
export const DEFAULT_END_DATE = '2099-12-31 23:59:59'; // 默认的结束时间

export const COMPANY_NAME = '桑田有鱼科技（成都）有限公司';
export const noop = () => {}; // 空函数

export const BoolOptions = [
  {label: '是', value: BoolEnum.TRUE},
  {label: '否', value: BoolEnum.FALSE},
];
//年月日周选择器
export const date = [
  {
    value: 'day',
    label: '日',
  },
  {
    value: 'week',
    label: '周',
  },
  {
    value: 'month',
    label: '月',
  },
  {
    value: 'year',
    label: '年',
  },
];
export {getBaseURL} from './url';
