// 商户相关类型

import {BoolEnum, DateTimeString, BoolNumber} from './common';

export enum ShopType {
  one = 1, //1是单店
  more = 2, //2是多店
}
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
  avatar: string;
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
  latitude: string | number;
  longitude: string | number;
  contactPhone?: string; // 店铺电话
  addressDetail?: string; // 店铺地址
  checked?: boolean;
  bizUserId?: number;
}
export interface ShopF extends ShopForm {
  id: number;
}

export interface UploadFile {
  url?: string;
  uid: string;
  uri?: string;
  name?: string;
  state?: 'success' | 'uploading';
  // size?: number;
}
//这是后端返回的数据
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
  areaInfo: number[]; //地区
  locationWithCompanyId?: number; //站点
}
//这是表单需要的数据
export interface FormMerchant {
  name: string; // 商家名称
  categoryId: number; // 行业（分类）ID
  multiStore: BoolEnum; // 店铺类型，1是单店，2是多店
  businessType: MerchantType;
  avatar?: UploadFile[]; // 商家logo
  address?: string; // 商家地址
  businessLicense?: UploadFile[]; // 营业执照图片地址
  businessName: string; // 企业名称
  enterpriseUsci?: string; // 统一社会信用代码
  legalAuthType: MerchantAgentType; // 认证类型,法人还是经办人
  legalName: string; // 法人姓名
  legalNumber: string; // 法人身份证号
  legalPhone: string; // 法人电话
  type?: MerchantCreateType; // 默认0公海用户，1私海用户
  shopList?: ShopForm[]; // 店铺列表
  areaInfo: number[]; //地区
  id?: number;
  locationWithCompanyId?: number; //站点
}
// MerchantForm的枚举类型
export type MerchantFormEnum = keyof FormMerchant;

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

export enum MerchantAction {
  ADD = 0, //新增
  EDIT = 1, //编辑
  VIEW = 2, // 查看
}
