import {DateTimeString} from './common';
export enum UserState {
  UN_CERTIFIED = 0, // 未认证
  CERTIFIED = 1, // 已认证
  BLOCKED = 2, // 禁止登录
}
export enum UserType {
  NORMAL = 0, // 普通用户
  STAFF = 1, // 员工
}

export enum LoginState {
  None = 'None',
  Loading = 'Loading',
  Success = 'Success',
  Error = 'Error',
}

export interface UserInfo {
  id: number;
  token: string;
  name: string;
  avatar: string;
  privateSeaLimit: number;
  privateSeaNums: number;
  status: UserState;
  telephone: string;
  type: UserType;
}
export interface LoginParam {
  phone: string;
  code: string;
}

export interface CertificateParam {
  telephone: string;
  name: string;
  idCard: string;
}

export interface WalletInfo {
  balance: number; // 余额
  balanceYuan: string;
  totalMoney: number; // 总收益
  totalMoneyYuan: string;
  withdrawalMoney: number; // 已提现金额
  withdrawalMoneyYuan: string;
  bankCard: string; // 银行卡号
  bankTelephone: string; // 银行预留手机号
  cardholder: string; // 持卡人
  crmUserId: number; // crm用户id
  idCard: string; // 实名身份证号
}

export enum UserWithdrawalRecordStatus {
  CHECKING = 0, // 审核中
  CHECKED = 1, // 审核通过
  REJECTED = 2, // 审核不通过
  TRANSFERRED = 3, // 已转账
  TRANSFER_FAILED = 4, // 转账失败
}

export interface UserWithdrawalRecord {
  id: number;
  createdTime: DateTimeString;
  crmUserId: number;
  money: number;
  moneyYuan: string;
  status: UserWithdrawalRecordStatus;
  walletId: number;
}

export interface ChangeBankForm {
  cardNo: string;
  bankCode: string;
  mobileNo: string;
}

export interface Bank {
  id?: number;
  bankCode: string;
  bankName: string;
}