import {Moment} from 'moment';
import {BoolEnum, DateTimeString} from './common';

/**
 * 限购类型
 * @enum {number}
 * @property {number} BuyLimitType.NONE 不限购
 * @property {number} BuyLimitType.PHONE 按手机号限购
 * @property {number} BuyLimitType.ID_CARD 按身份证号限购
 */
export enum BuyLimitType {
  NONE = 0,
  PHONE = 1,
  ID_CARD = 2,
}

/**
 * 银行账户类型
 * @enum {number}
 * @property {number} AccountType.CORPORATE 对公账户
 * @property {number} AccountType.PRIVATE 对私账户
 */
export enum AccountType {
  CORPORATE = 0,
  PERSONAL = 1,
}

/**
 * 协议类型
 * @enum {number}
 * @property {number} ProtocolType.TWO_PARTY 两方协议
 * @property {number} ProtocolType.THREE_PARTY 三方协议
 */
export enum ProtocolType {
  TWO_PARTY = 2,
  THREE_PARTY = 3,
}

/**
 * 结算方式
 * @enum {number}
 * @property {number} SettlementType.T0 T+0结算
 */
export enum SettlementType {
  T1 = 0,
}

/**
 * 开票类型
 * @enum {number}
 * @property {number} InvoiceType.PLATFORM 平台开票
 * @property {number} InvoiceType.PURCHASE 采购开票
 */
export enum InvoiceType {
  PLATFORM = 0,
  PURCHASE = 1,
}

export enum BookingType {
  NONE = 0,
  PHONE = 1,
  URL = 2,
}

export interface ContractBookingInfo {
  /**
   * 预定开始时间，用于前端表单，使用时需转化成bookingBeginTime
   */
  _bookingBeginTime?: Moment;

  /**
   * 预约开始时间
   * @type {string} 格式：yyyy-MM-dd HH:mm:ss
   */
  bookingBeginTime?: DateTimeString;

  /**
   * 是否可取消预约
   * @type {BoolEnum}
   */
  bookingCanCancel: BoolEnum;

  /**
   * 取消预约需提前几天, 0表示不限制
   * @type {number}
   */
  bookingCancelDay: number;

  /**
   * 预约需提前几天
   * @type {number}
   */
  bookingEarlyDay: number;

  /**
   * 发码类型, 由接口获取
   * @type {number}
   */
  codeType?: number;

  /**
   * 预约方式
   * @type {BookingType}
   * @property {BookingType} NONE 无需预约
   * @property {BookingType} PHONE 电话预约
   * @property {BookingType} URL 网址预约
   */
  bookingType: BookingType;

  /**
   * 售卖时间，用于前端表单，使用时需转化成saleBeginTime和saleEndTime
   */
  _saleTime?: [Moment, Moment];

  /**
   * 开售时间
   * @type {string} 格式：yyyy-MM-dd HH:mm:ss
   */
  saleBeginTime?: DateTimeString;

  /**
   * 售卖结束时间
   * @type {string} 格式：yyyy-MM-dd HH:mm:ss
   */
  saleEndTime?: DateTimeString;

  /**
   * 使用时间，用于前端表单，使用时需转化成useBeginTime和useEndTime
   */
  _useTime?: [Moment, Moment];

  /**
   * 使用开始时间
   * @type {string} 格式：yyyy-MM-dd HH:mm:ss
   */
  useBeginTime?: DateTimeString;

  /**
   * 使用结束时间
   * @type {string} 格式：yyyy-MM-dd HH:mm:ss
   */
  useEndTime?: DateTimeString;
}

/**
 * SKU包含的商品详情
 * @property {string} name 名称
 * @property {number} nums 数量
 * @property {number} price 价格，单位：元
 */
export interface ContractSKUDetail {
  name: string;
  nums: number;
  price: number;
}

/**
 * sku详情，如限购数量，限购类型，限购价格等
 */
export interface ContractSKUInfo {
  /**
   * 限购数量
   * @type {number}
   */
  buyLimitNum: number;

  /**
   * 限购类型
   * @type {BuyLimitType}
   */
  buyLimitType: BuyLimitType;

  /**
   * 合同里的skuId， 这个id和商品中的skuId不同
   */
  contractSkuId?: number;

  /**
   * 商品中的skuId
   */
  skuId?: number;

  /**
   * sku包含的商品详情
   * @type {ContractSKUDetail[]}
   */
  skuDetails: ContractSKUDetail[];

  /**
   * sku名称
   * @type {string}
   */
  skuName: string;

  /**
   * 结算价，单位：元
   * @type {number}
   */
  skuSettlementPrice: number;

  /**
   * sku的库存，如果开启共享库存，忽略该值
   * @type {number}
   */
  skuStock?: number;
}

/**
 * sku的整体信息，如是否开启共享库存，库存数量等
 */
export interface ContractSKU {
  /**
   * 是否开启共享库存
   * @type {BoolEnum}
   */
  openSkuStock: BoolEnum;

  /**
   * sku详情
   * @type {ContractSKUInfo[]}
   */
  skuInfo: ContractSKUInfo[];

  /**
   * 总库存
   * @type {number}
   */
  spuStock: number;
}

/**
 * spu的信息，如名称，分类，库存等
 */
export interface ContractSPU {
  /**
   * 可使用的店铺ID
   */
  canUseBizShopIds: number[];

  /**
   * 开票类型
   */
  invoiceType: InvoiceType;

  /**
   * 商品分类ID
   */
  spuCategoryIds: number[];

  /**
   * 商品名称
   */
  spuName: string;

  /**
   * 是否开启店铺互斥
   */
  storeMutualExclusion: BoolEnum;
}

export interface ContractFile {
  /**
   * 图片的OSS地址
   * @type {string}
   */
  ossUrl: string;
}

export interface ContractForm {
  /**
   * 商户ID
   */
  bizUserId?: number;

  /**
   * 预约信息
   */
  bookingReq: ContractBookingInfo;

  /**
   * 合同名称
   */
  contractName: string;

  /**
   * 合同附件
   * @type {ContractFile[]}
   */
  fileList?: ContractFile[];

  /**
   * 甲方收款账户类型
   */
  partyAAccountType: AccountType;

  /**
   * 甲方收款账户
   */
  partyABankAccount: string;

  /**
   * 开户人姓名
   */
  partyABankAccountName: string;

  /**
   * 甲方收款账户开户行地址
   */
  partyABankAddress: string;

  /**
   * 甲方名称
   */
  partyAName: string;

  /**
   * 乙方名称, 目前是固定的
   */
  partyBName: string;

  /**
   * 协议类型
   */
  protocolType: ProtocolType;

  /**
   * 结算方式
   */
  settlementType: SettlementType;

  /**
   * sku信息
   */
  skuInfoReq: ContractSKU;

  /**
   * 商品信息
   */
  spuInfoReq: ContractSPU;
}
export interface ContractDetailF extends ContractForm {
  id: number;
}
export enum ContractStatus {
  Draft = 0,
  Pending = 1, // 待审核
  Resolved = 2,
  Rejected = 3, // 审核不通过
  SignSuccess = 4,
  Expired = 5,
  RejectedByPartyA = 6, // 用户拒签
}

export type ContractDetailEnum = keyof Contract;
/**
 * 列表里的合同信息
 */
export interface ContractList {
  id: number;
  createdTime: DateTimeString;
  name: string;
  settlementType: SettlementType;
  status: number; // todo: ？
  statusStr: string;
  type: number; // todo: ？
  typeStr: string;
}
export interface ContractF {
  bizUserId?: number;
  bookingReq: any;
  contractName: string;
  id?: number;
  partyAName?: string;
  partyBName?: string;
  protocolType?: number;
  settlementType?: number;
  spuInfoReq: SpuInfoReq;
  skuInfoReq: SkuInfoReqF;
}

// 新增合同, form需要的值
export interface Contract {
  bizUserId: number;
  bookingReq: any;
  contractName: string;
  id?: number;
  partyAAccountType?: number;
  partyABankAccount?: number;
  partyABankAccountName?: string;
  partyABankAddress?: string;
  partyAIsLegalPerson?: number;
  partyAName?: string;
  partyBName?: string;
  protocolType?: number;
  settlementType?: number;
  status?: number;
  type?: number;
  spuInfoReq: SpuInfoReq;
  skuInfoReq: SkuInfoReq;
}

export interface SpuInfoReq {
  // bizUserName: string;
  // canUseBizShopIds: string[];
  contractSpuId: number;
  invoiceType: number;
  spuCategoryIds: number[];
  spuName: string;
  // storeMutualExclusion: number;
}
export interface SkuInfoReq {
  openSkuStock: boolean;
  skuInfo: SkuInfo[];
  spuStock: string;
}
export interface SkuInfoReqF {
  openSkuStock: number;
  skuInfo: SkuInfoF[];
  spuStock: number;
}
export interface SkuInfoF {
  buyLimitNum?: number;
  buyLimitType?: number;
  contractSkuId?: number;
  skuDetails: SkuDetails[];
  skuName: string;
  skuSettlementPrice: string;
  skuStock: string;
}
export interface SkuInfo {
  buyLimitNum?: string;
  buyLimitType?: number;
  contractSkuId?: number;
  skuDetails: SkuDetails[];
  skuName: string;
  skuSettlementPrice: string;
  skuStock: string;
}
export interface SkuDetails {
  id?: string;
  name: string;
  nums: string;
  price: string;
  skuId?: string;
}

export interface BookingReq {
  bookingBeginTime?: Moment; //预约开始时间
  bookingCanCancel?: number; //是否可以取消
  bookingCancelDay?: string;
  bookingEarlyDay?: string;
  bookingType?: number;
  // codeTime?: Moment;
  codeType?: number;
  // delayedSending?: string;
  // needShowTime?: Moment;
  saleBeginTime?: Moment;
  saleEndTime?: Moment;
  // showBeginTime?: Moment;
  // showEndTime?: Moment;
  useBeginTime?: Moment;
  useEndTime?: Moment;
}

export enum ContractAction {
  ADD = 0,
  EDIT = 1,
  VIEW = 2,
}
