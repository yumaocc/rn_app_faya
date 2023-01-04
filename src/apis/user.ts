import {post, get, getPaged} from './helper';
import {Bank, CertificateParam, ChangeBankForm, LoginParam, PagedData, PageParam, SearchParam, UserInfo, UserWithdrawalRecord, WalletInfo, WithdrawalFrom} from '../models';

export async function userLogin(params: LoginParam): Promise<UserInfo> {
  return await post<UserInfo, LoginParam>('/crm/user/login', {
    phone: params.phone,
    code: params.code,
  });
}

export async function getUserInfo(): Promise<UserInfo> {
  return await get<UserInfo>('/crm/user/mine/info');
}

// 用户实名认证
export async function certificate(params: CertificateParam) {
  return await post<boolean, CertificateParam>('/crm/user/personal/authentication', params);
}

// 发送验证码
export async function sendVerifyCode(phone: string) {
  return await post<boolean, {phone: string}>('/crm/user/sms/with/login', {
    phone,
  });
}

export async function getWallet(): Promise<WalletInfo> {
  return await get<WalletInfo>('/crm/user/wallet/info');
}

// 提现记录
export async function getWithdrawalRecords(param: PageParam): Promise<PagedData<UserWithdrawalRecord[]>> {
  return await getPaged<UserWithdrawalRecord[]>('/crm/user/withdrawal/log/page', {params: param});
}
export async function getWithdrawal(param: WithdrawalFrom): Promise<boolean> {
  return await post<boolean, WithdrawalFrom>('/yeepay/withdraw/money', param);
}
// 更换银行卡
export async function changeBank(param: ChangeBankForm) {
  return await post<boolean, ChangeBankForm>('/crm/user/wallet/modify/bank', param);
}

export async function getSupportBankList(): Promise<Bank[]> {
  return await get<Bank[]>('/bank/company/list');
}

//历史收益
export async function getHistoricalIncome(params?: SearchParam) {
  return await get(`/sku/commission/history/with/month?beginTime=${params.beginTime}&endTime=${params.endTime}`);
}
