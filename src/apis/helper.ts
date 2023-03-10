import axios, {AxiosRequestConfig, AxiosResponse} from 'axios';
import {REQUEST_TIMEOUT} from '../constants';
import {PagedData, Response, AppHeader, CustomError} from '../models';
import {Platform} from 'react-native';
import packageJSON from '../../package.json';

const currentHeader = axios.defaults.headers.common || {};
const headers: AppHeader = {
  os: `${Platform.OS}|${Platform.Version || 'N/A'}`,
  version: packageJSON.version,
  platform: 'APP',
  project: 'FAYABD',
};
axios.defaults.headers.common = {...currentHeader, ...headers};

axios.defaults.timeout = REQUEST_TIMEOUT;

export function resetBaseURL(baseURL: string) {
  axios.defaults.baseURL = baseURL;
}
export function resetToken(token: string) {
  axios.defaults.headers.common.token = token;
}

axios.interceptors.response.use((response: AxiosResponse) => {
  const {data} = response;
  if (__DEV__) {
    console.log('响应体', data.data?.content || data);
  }
  switch (data.code) {
    case 8000:
      const {code, msg} = data;
      throw new CustomError(msg, code);
    default:
      return response;
  }
});
// axios.interceptors.request.use(res => {
//   console.log('请求体', res);
//   return res;
// });

export async function getPaged<T>(url: string, config?: AxiosRequestConfig): Promise<PagedData<T>> {
  const res = await axios.get<Response<T>>(url, config);
  if (res.data.code === 1) {
    return res.data.data;
  }
  throw new CustomError(res.data.msg, res.data.code);
}

export async function postPaged<T, P>(url: string, data?: P, config?: AxiosRequestConfig): Promise<PagedData<T>> {
  const res = await axios.post<Response<T>>(url, data, config);
  if (res.data.code === 1) {
    return res.data.data;
  }
  throw new CustomError(res.data.msg, res.data.code);
}

export async function get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const res = await getPaged<T>(url, config);
  return res.content;
}
export async function post<T, P>(url: string, data?: P, config?: AxiosRequestConfig): Promise<T> {
  const res = await postPaged<T, P>(url, data, config);
  return res.content;
}
