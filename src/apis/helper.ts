import axios, {AxiosRequestConfig, AxiosResponse} from 'axios';
import {REQUEST_TIMEOUT} from '../constants';
import {CustomError, PagedData, Response} from '../models';

axios.defaults.timeout = REQUEST_TIMEOUT;

export function resetBaseURL(baseURL: string) {
  axios.defaults.baseURL = baseURL;
}
export function resetToken(token: string) {
  axios.defaults.headers.common.token = token;
}

axios.interceptors.response.use((response: AxiosResponse) => {
  const {data} = response;
  switch (data.code) {
    case 8000:
      location.href = '/#/login';
      // throw new CustomError('登录失效，请重新登录', 8000);
      return response;
    default:
      return response;
  }
});

export async function getPaged<T>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<PagedData<T>> {
  const res = await axios.get<Response<T>>(url, config);
  if (res.data.code === 1) {
    return res.data.data;
  }
  throw new CustomError(res.data.msg, res.data.code);
}

export async function postPaged<T, P>(
  url: string,
  data?: P,
  config?: AxiosRequestConfig,
): Promise<PagedData<T>> {
  const res = await axios.post<Response<T>>(url, data, config);
  if (res.data.code === 1) {
    return res.data.data;
  }
  throw new CustomError(res.data.msg, res.data.code);
}

export async function get<T>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<T> {
  const res = await getPaged<T>(url, config);
  return res.content;
}
export async function post<T, P>(
  url: string,
  data?: P,
  config?: AxiosRequestConfig,
): Promise<T> {
  const res = await postPaged<T, P>(url, data, config);
  return res.content;
}
