import {Moment} from 'moment';
import {BoolEnum, DateTimeString, FileWithURL} from './common';
import {BookingType, BuyLimitType} from './contract';

export enum SPUStatus {
  ON_SALE = 1, // 在售
  SOLD_OUT = 2, // 已下架
  WILL_SOLD_OUT = 3, // 即将下架
}

export interface SPUCategory {
  id: number;
  name: string;
  children?: SPUCategory[];
}
/**
 * @deprecated 已废弃，请使用SKUBuyNoticeF
 */
export interface SPUPurchaseNotice {
  id?: number;
  type: SKUBuyNoticeType;
  content: string;
}

export interface SPUCodeType {
  name: string;
  codeType: number;
}

// BOOKING 预约须知，SALE_TIME售卖、营业时间，USE_RULE使用规则，TIPS温馨提示，POLICY取消政策
export type SKUBuyNoticeType = 'BOOKING' | 'SALE_TIME' | 'USE_RULE' | 'TIPS' | 'POLICY';

// 购买须知，后端返回的
export interface SKUBuyNoticeF {
  id?: number;
  type: SKUBuyNoticeType;
  content: string;
}

// 组织成这个格式
export type SKUBuyNotice = {
  [key in SKUBuyNoticeType]: string[];
};

export interface SPUBanner {
  id?: number;
  url: string;
}

export interface PackagedSKU {
  id?: number;
  packageName: string;
  show: BoolEnum;
  skus: PackagedSKUItem[];
}

export interface PackagedSKUItem {
  contractSkuId: number;
  nums: number;
  skuId?: number;
  _skuName?: string;
  _selected?: boolean;
}
export type PackagedSKUForm = PackagedSKU;

// sku包含
export interface SKUDetail {
  name: string;
  price: number;
  nums: number;
}

export interface SKU {
  contractSkuId?: number; // 合同detail中的contractSkuId字段
  list: SKUDetail[];
  originPrice?: number; // 原价
  salePrice?: number; // 售价
  show: BoolEnum; // 是否显示
  skuId?: number; // 修改商品时需要给后端
  skuName?: string; // sku名称
  _settlementPrice?: number; // 结算价
  _stock?: number; // 合同里的最大库存
  skuStock?: number; // 套餐库存
  _buyLimitNum: number; // 限购数量
  _buyLimitType: BuyLimitType; // 限购类型
  _fold: BoolEnum; // 是否展开
}

export interface BookingModel {
  modelId: number; // 预约型号ID
  contractSkuIds: number[];
  skuIds?: number[];
  _supportSKUs?: {
    _contractSkuId: number;
    _skuId: number;
  };
}

// SPU表单数据，新增和编辑都用这个
export interface SPUForm {
  id?: number; // 如果是新增，则不会有id
  bizUserId?: number; // 商户ID
  bannerPhotos: string[] | SPUBanner[];
  baseSaleAmount: number; // 初始销量
  canUseShopIds: any[]; // 可用的店铺id
  contractId?: number; // 合同id
  modelList: BookingModel[];
  needExpress: BoolEnum; // 下单时是否需要快递
  needIdCard: BoolEnum; // 下单时是否需要身份证
  packageList?: PackagedSKU[]; // 组合sku
  poster: string; // 封面图
  _poster?: FileWithURL[];
  purchaseNoticeEntities: SKUBuyNoticeF[]; // 购买须知
  _bookingNotice: string[];
  _saleTimeNotice: string[];
  _useRuleNotice: string[];
  _tipsNotice: string[];
  _policyNotice: string[];
  saleBeginTime?: DateTimeString; // 开售时间
  _saleBeginTime?: Moment;
  saleEndTime?: DateTimeString; // 售卖结束时间
  _saleEndTime?: Moment;
  _saleTime?: [Moment, Moment]; // 售卖时间，用于前端表单，使用时需转化成saleBeginTime和saleEndTime
  shareCount?: number; // 分享次数
  baseShareCount: number; // 基础分享数
  skuList: SKU[]; // sku列表
  spuHtml: string; // 图文详情
  spuName: string; // spu名称
  stockAmount: number; // 库存
  useBeginTime?: DateTimeString; // 使用开始时间
  useEndTime?: DateTimeString; // 使用结束时间
  _useBeginTime?: Moment;
  _useEndTime?: Moment;
  _useTime?: [Moment, Moment]; // 使用时间，用于前端表单，使用时需转化成useBeginTime和useEndTime
  showBeginTime?: DateTimeString; // 显示时间
  _showBeginTime?: Moment;
  _openSKUStock?: boolean; // 是否开启套餐单独设置库存
  subName?: string;
  locationWithCompanyId?: number; //站点
}
export interface SPUDetailF extends SPUForm {
  id: number;
}

// spu表格数据中的sku信息
export interface SPUTableSKU {
  skuId: number;
  skuName: string;
  saleAmount: number;
  skuStock: number;
  skuSettlePrice: number; // 结算价
  skuRemainingStock: number;
  skuSalePrice: number;
}
export interface SPUF {
  id: number;
  poster: string; // 封面图
  statusStr: string; // 状态
  status?: number; //状态码
  bizName: string;
  bookTypeStr: string;
  bookingType: BookingType;
  categoryName: string;
  hasSoldout: BoolEnum;
  saleBeginTime: DateTimeString;
  saleEndTime: DateTimeString;
  spuName: string;
  skuList: SPUTableSKU[];
}

//商品销售前十
export interface SalesList {
  allCommission: number;
  allSaleAmount: number;
  name: string;
  saleBeginTime: string;
  saleEndTime: string;
  spuId: number;
}

export interface Notice {
  BOOKING: {type: SKUBuyNoticeType; content: string}[];
  SALE_TIME: {type: SKUBuyNoticeType; content: string}[];
  USE_RULE: {type: SKUBuyNoticeType; content: string}[];
  POLICY: {type: SKUBuyNoticeType; content: string}[];
  TIPS: {type: SKUBuyNoticeType; content: string}[];
}
