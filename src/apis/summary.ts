import {get, getPaged} from './helper';
import {CommissionExpect, CommissionHistory, CommissionToday, CommissionTop, HomeStatisticsF, SaleTop, CommissionDetail, SearchParam, PagedData, DateTimeString} from '../models';

export async function loadHome(): Promise<HomeStatisticsF> {
  return await get<HomeStatisticsF>('/crm/home/mine/spus');
}

export async function loadCommissionToday(): Promise<CommissionToday> {
  return await get<CommissionToday>('/sku/commission/today');
}

export async function loadCommissionExpect(): Promise<CommissionExpect> {
  return await get<CommissionToday>('/sku/commission/will/in');
}

export async function loadCommissionTop(beginTime: DateTimeString, endTime: DateTimeString): Promise<CommissionTop> {
  return await get<CommissionTop>('/sku/commission/top/ten', {
    params: {beginTime, endTime},
  });
}

export async function loadSalesTop(beginTime: DateTimeString, endTime: DateTimeString): Promise<SaleTop> {
  return await get<SaleTop>('/sku/commission/top/ten/income', {
    params: {beginTime, endTime},
  });
}

export async function loadCommissionHistory(): Promise<CommissionHistory> {
  return await get<CommissionHistory>('/sku/commission/history');
}

export async function getCommissionOrder(param: SearchParam): Promise<PagedData<CommissionDetail[]>> {
  console.log('请求参数', param);
  return await getPaged<CommissionDetail[]>('/sku/commission/details/page', {
    params: param,
  });
}

// 预计收入列表
export async function getExpectCommissionOrder(param: SearchParam): Promise<PagedData<CommissionDetail[]>> {
  return await getPaged<CommissionDetail[]>('/sku/commission/details/paid/page', {params: param});
}
