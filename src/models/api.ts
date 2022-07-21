import {PageParam, SearchForm} from './common';

export interface PagedData<T> {
  content: T;
  page?: {
    pageIndex: number;
    pageSize: number;
    pageTotal: number;
  };
}

export interface Response<T> {
  code: number;
  msg: string;
  data: PagedData<T>;
}

export interface FetchData {
  (page: PageParam, search: SearchForm): Promise<PagedData<unknown>>;
}

export interface IDBody {
  id: number | string;
}
