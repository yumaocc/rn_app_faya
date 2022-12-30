import {COMPANY_NAME} from '../constants';
import {formatMoment, momentFromDateTime} from './util';
import {AccountType, BookingType, BoolEnum, BuyLimitType, Contract, ContractF, ContractForm, ContractSKUInfo, InvoiceType, ProtocolType, SettlementType} from '../models';

export function getInitContractSku(): ContractSKUInfo {
  return {
    skuName: '',
    skuId: undefined,
    skuSettlementPrice: 0,
    buyLimitNum: 0,
    buyLimitType: BuyLimitType.NONE,
    skuDetails: [],
  };
}

export function getInitContractForm(): ContractForm {
  return {
    bizUserId: undefined,
    bookingReq: {
      _saleTime: undefined,
      _bookingBeginTime: undefined,
      _useTime: undefined,
      bookingBeginTime: undefined,
      bookingCanCancel: BoolEnum.TRUE,
      bookingCancelDay: 2,
      bookingEarlyDay: 1,
      codeType: undefined,
      bookingType: BookingType.URL,
      saleBeginTime: undefined,
      saleEndTime: undefined,
      useBeginTime: undefined,
      useEndTime: undefined,
    },
    contractName: '',
    fileList: [],
    partyAAccountType: AccountType.CORPORATE,
    partyABankAccount: '',
    partyABankAddress: '',
    partyABankAccountName: '',
    partyAName: '',
    partyBName: COMPANY_NAME,
    protocolType: ProtocolType.TWO_PARTY,
    settlementType: SettlementType.T1,
    skuInfoReq: {
      openSkuStock: BoolEnum.FALSE,
      spuStock: 0,
      skuInfo: [getInitContractSku()],
    },
    spuInfoReq: {
      canUseBizShopIds: [],
      invoiceType: InvoiceType.PLATFORM,
      spuCategoryIds: [],
      spuName: '',
      storeMutualExclusion: BoolEnum.FALSE,
    },
  };
}
//格式化后端返回的数据
export function generateContractFormPatch(contractForm: ContractF): Contract {
  const {bookingBeginTime, useBeginTime, useEndTime, saleBeginTime, saleEndTime, bookingEarlyDay, bookingCancelDay} = contractForm.bookingReq || {};
  const {skuInfoReq} = contractForm;
  const {
    skuInfoReq: {skuInfo, spuStock},
  } = contractForm;
  //将套餐价格之类的东西从number变成string,表单需要
  const _skuInfo = JSON.parse(JSON.stringify(skuInfo));
  _skuInfo.forEach((item: {skuStock: string; skuSettlementPrice: string; buyLimitNum: string; skuDetails: any[]}) => {
    item.skuStock = `${item.skuStock}`;
    item.skuSettlementPrice = `${item.skuSettlementPrice}`;
    item.buyLimitNum = `${item.buyLimitNum}`;
    item.skuDetails.forEach(item => {
      item.nums = `${item.nums}`;
      item.price = `${item.price}`;
    });
  });
  const _skuInfoReq = {...skuInfoReq, openSkuStock: skuInfoReq.openSkuStock ? true : false, skuInfo: _skuInfo, spuStock: `${spuStock}`};

  const res = {
    ...contractForm,
    skuInfoReq: _skuInfoReq,
    bookingReq: {
      ...contractForm.bookingReq,
      saleBeginTime: momentFromDateTime(saleBeginTime!)! || undefined,
      saleEndTime: momentFromDateTime(saleEndTime!)! || undefined,
      useBeginTime: momentFromDateTime(useBeginTime!)! || undefined,
      useEndTime: momentFromDateTime(useEndTime!)! || undefined,
      bookingBeginTime: momentFromDateTime(bookingBeginTime!)!,
      bookingEarlyDay: `${bookingEarlyDay}`,
      bookingCancelDay: `${bookingCancelDay}`,
    },
  };
  return res;
}
//格式化数据发送给后端
export function cleanContractForm(contractForm: Contract): ContractF {
  const {bookingBeginTime, useBeginTime, useEndTime, saleBeginTime, saleEndTime, bookingEarlyDay, bookingCancelDay} = contractForm.bookingReq || {};
  const {skuInfoReq} = contractForm;
  const {
    skuInfoReq: {skuInfo, spuStock},
  } = contractForm;
  //将套餐价格之类的东西从number变成string,表单需要
  const _skuInfo = JSON.parse(JSON.stringify(skuInfo));
  _skuInfo.forEach((item: {skuStock: number; skuSettlementPrice: number; buyLimitNum: number; skuDetails: any[]}) => {
    item.skuStock = Number(item.skuStock);
    item.skuSettlementPrice = Number(item.skuSettlementPrice);
    item.buyLimitNum = Number(item.buyLimitNum);
    item.skuDetails.forEach(item => {
      item.nums = Number(item.nums);
      item.price = Number(item.price);
    });
  });
  const _skuInfoReq = {...skuInfoReq, openSkuStock: skuInfoReq.openSkuStock ? 1 : 0, skuInfo: _skuInfo, spuStock: Number(spuStock)};
  const res = {
    ...contractForm,
    skuInfoReq: _skuInfoReq,
    bookingReq: {
      ...contractForm.bookingReq,
      saleBeginTime: formatMoment(saleBeginTime!)! || undefined,
      saleEndTime: formatMoment(saleEndTime!)! || undefined,
      useBeginTime: formatMoment(useBeginTime!)! || undefined,
      useEndTime: formatMoment(useEndTime!)! || undefined,
      bookingBeginTime: formatMoment(bookingBeginTime!)!,
      bookingEarlyDay: Number(bookingEarlyDay),
      bookingCancelDay: Number(bookingCancelDay),
    },
  };
  return res;
}
