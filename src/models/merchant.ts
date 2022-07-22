// 商户相关类型

import {BoolEnum, DateTimeString, BoolNumber} from './common';

// 通用商家
export interface MerchantF {
  id: number;
  name: string;
  address: string;
  categoryName: string;
  claimTime: DateTimeString;
  createdTime: DateTimeString;
  hasAuth: BoolNumber;
  multiStore: BoolNumber;
}

// 我的商家
export interface MyMerchantF {
  id: number;
  avatar?: string;
  categoryName?: string;
  multiStore?: BoolNumber;
  name?: string; // 商户名称
  saleProductNums?: number;
  shopNums?: number;
  signTime?: DateTimeString;
  status?: BoolNumber;
}
export interface MyMerchantSimpleF {
  id: number;
  name: string;
  partyAName: string;
}

export type MerchantSimpleF = MyMerchantSimpleF;

export interface ShopForm {
  id?: number;
  shopName?: string;
  contactPhone?: string; // 店铺电话
  addressDetail?: string; // 店铺地址
}
export interface ShopF extends ShopForm {
  id: number;
}

export interface MerchantForm {
  name: string; // 商家名称
  categoryId: number; // 行业（分类）ID
  multiStore: BoolEnum; // 店铺类型，1是单店，2是多店
  businessType: MerchantType;
  avatar?: string; // 商家logo
  address?: string; // 商家地址
  businessLicense?: string; // 营业执照图片地址
  businessName: string; // 企业名称
  enterpriseUsci?: string; // 统一社会信用代码
  legalAuthType: MerchantAgentType; // 认证类型,法人还是经办人
  legalName: string; // 法人姓名
  legalNumber: string; // 法人身份证号
  legalPhone: string; // 法人电话
  type?: MerchantCreateType; // 默认0公海用户，1私海用户
  shopList?: ShopForm[]; // 店铺列表
}

export interface MerchantDetailF extends MerchantForm {
  id: number;
}

export interface MerchantCategory {
  id: number;
  name: string;
}

export interface MerchantBookingModelF {
  id: number;
  name: string;
  bizUserId: number;
  createdTime: DateTimeString;
}
export enum MerchantCreateType {
  PUBLIC_SEA = 0, // 新增后会直接到公海
  PRIVATE_SEA = 1, // 新增后会直接到私海
}

export enum MerchantType {
  ENTERPRISE = 0, // 企业
  INDIVIDUAL = 1, // 个体工商户
}
export enum MerchantAgentType {
  LEGAL = 0, // 法人
  AGENT = 1, // 经办人
}
