import {SPUStatus} from './spu';

export interface SummarySPU {
  name: string;
  money: number;
  moneyYuan: string;
  avatar: string;
}

export interface Commission {
  money: number;
  moneyYuan: string;
  list: SummarySPU[];
}

export interface TopSPU {
  allCommission: number;
  allCommissionYuan: string;
  allSaleAmount: number;
  name: string;
  saleBeginTime: DateTimeString;
  saleEndTime: DateTimeString;
  spuId: number;
}

export interface CommissionRecord {
  dateStr: string;
  money: number;
  moneyYuan: string;
}

export type CommissionExpect = Commission;
export type CommissionToday = Commission;
export type CommissionTop = TopSPU[];
export type SaleTop = TopSPU[];

export type CommissionHistory = {
  list: CommissionRecord[];
  money: number;
  moneyYuan: string;
};

export interface CommissionDetail {
  bizName: string;
  money: number;
  moneyYuan: string;
  paidTime: DateTimeString;
  poster: string;
  saleBeginTime: DateTimeString;
  saleEndTime: DateTimeString;
  spuId: number;
  spuName: string;
  status: SPUStatus;
  statusStr: string;
}
