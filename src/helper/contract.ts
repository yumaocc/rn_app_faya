import {cleanPrivateProperty} from './common';
import {COMPANY_NAME} from '../constants';
import {formatMoment, momentFromDateTime} from './util';
import {
  AccountType,
  BookingType,
  BoolEnum,
  BuyLimitType,
  ContractDetailF,
  ContractForm,
  ContractSKUInfo,
  InvoiceType,
  ProtocolType,
  SettlementType,
} from '../models';

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
    settlementType: SettlementType.T0,
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

export function generateContractFormPatch(
  detail: ContractDetailF,
): Partial<ContractForm> {
  const form: Partial<ContractForm> = {};
  const bookingReq = {...detail.bookingReq};
  const {
    bookingBeginTime,
    saleBeginTime,
    saleEndTime,
    useBeginTime,
    useEndTime,
  } = bookingReq;
  if (saleBeginTime && saleEndTime) {
    bookingReq._saleTime = [
      momentFromDateTime(saleBeginTime),
      momentFromDateTime(saleEndTime),
    ];
  }
  if (useBeginTime && useEndTime) {
    bookingReq._useTime = [
      momentFromDateTime(useBeginTime),
      momentFromDateTime(useEndTime),
    ];
  }
  if (bookingBeginTime) {
    bookingReq._bookingBeginTime = momentFromDateTime(bookingBeginTime);
  }
  form.bookingReq = {...bookingReq};
  return form;
}

export function cleanContractForm(contractForm: ContractForm): ContractForm {
  const {_bookingBeginTime, _saleTime, _useTime} =
    contractForm.bookingReq || {};

  const [useBeginTime, useEndTime] = _useTime?.map(formatMoment) || [];
  const [saleBeginTime, saleEndTime] = _saleTime?.map(formatMoment) || [];

  const res = {
    ...contractForm,
    bookingReq: {
      ...contractForm.bookingReq,
      saleBeginTime: saleBeginTime || undefined,
      saleEndTime: saleEndTime || undefined,
      useBeginTime: useBeginTime || undefined,
      useEndTime: useEndTime || undefined,
      bookingBeginTime: formatMoment(_bookingBeginTime!)!,
    },
  };

  return cleanPrivateProperty(res);
}
