import {isNil} from 'lodash';
import {cleanPrivateProperty} from './common';
import {findItem, formatMoment, momentFromDateTime} from './util';
import {
  BoolEnum,
  ContractDetailF,
  SKUBuyNotice,
  SKUBuyNoticeF,
  SKUBuyNoticeType,
  SPUDetailF,
  SPUForm,
  SPUPurchaseNotice,
  SKU,
} from '../models';

export function convertSKUBuyNotice(buyNotices: SKUBuyNoticeF[]): SKUBuyNotice {
  const result: SKUBuyNotice = {
    BOOKING: [],
    SALE_TIME: [],
    USE_RULE: [],
    TIPS: [],
    POLICY: [],
  };
  buyNotices.forEach(buyNotice => {
    result[buyNotice.type].push(buyNotice.content);
  });
  return result;
}

function convertToBuyNotice(
  type: SKUBuyNoticeType,
  contents: string[] = [],
): SPUPurchaseNotice[] {
  return contents.map(content => {
    return {
      type,
      content,
    };
  });
}

export function cleanSPUForm(spu: SPUForm): SPUForm {
  const {_saleTime} = spu;
  if (_saleTime && _saleTime.length) {
    const [saleBeginTime, saleEndTime] = _saleTime.map(formatMoment);
    spu.saleBeginTime = saleBeginTime!;
    spu.saleEndTime = saleEndTime!;
  }

  const {_showBeginTime} = spu;
  spu.showBeginTime = formatMoment(_showBeginTime!)!;

  const {
    _bookingNotice,
    _policyNotice,
    _tipsNotice,
    _useRuleNotice,
    _saleTimeNotice,
  } = spu;
  spu.purchaseNoticeEntities = [
    ...convertToBuyNotice('BOOKING', _bookingNotice),
    ...convertToBuyNotice('SALE_TIME', _saleTimeNotice),
    ...convertToBuyNotice('USE_RULE', _useRuleNotice),
    ...convertToBuyNotice('TIPS', _tipsNotice),
    ...convertToBuyNotice('POLICY', _policyNotice),
  ];

  return cleanPrivateProperty(spu);
}

// 默认的新增商品表单
export function getInitSPUForm(): SPUForm {
  return {
    id: undefined,
    bizUserId: undefined,
    bannerPhotos: [],
    baseSaleAmount: Math.floor(Math.random() * 400),
    canUseShopIds: [],
    contractId: undefined,
    modelList: [],
    needExpress: BoolEnum.FALSE,
    needIdCard: BoolEnum.TRUE,
    packageList: [],
    poster: '',
    purchaseNoticeEntities: [],
    _bookingNotice: [],
    _saleTimeNotice: [],
    _useRuleNotice: [],
    _tipsNotice: [],
    _policyNotice: [],
    saleBeginTime: undefined,
    saleEndTime: undefined,
    _saleTime: undefined,
    baseShareCount: Math.floor(Math.random() * 100),
    skuList: [],
    spuHtml: '',
    spuName: '',
    stockAmount: Math.floor(Math.random() * 10000),
    useBeginTime: undefined,
    useEndTime: undefined,
    _useTime: undefined,
    showBeginTime: undefined,
    _showBeginTime: undefined,
  };
}

export function generateSPUForm(
  contract: ContractDetailF,
  spuDetail?: SPUDetailF,
): Partial<SPUForm> {
  const form: Partial<SPUForm> = {};

  const {saleBeginTime, saleEndTime} = spuDetail || {};
  if (saleBeginTime && saleEndTime) {
    form._saleTime = [
      momentFromDateTime(saleBeginTime),
      momentFromDateTime(saleEndTime),
    ];
  }

  form.skuList = contract.skuInfoReq?.skuInfo?.map(contractSku => {
    const spuDetailSku = findItem(
      spuDetail?.skuList!,
      sku => sku.contractSkuId === contractSku.contractSkuId,
    );
    const hasSpuDetail = !isNil(spuDetailSku);
    const formSku: SKU = {
      contractSkuId: contractSku.contractSkuId,
      list: contractSku.skuDetails,
      originPrice: spuDetailSku?.originPrice,
      salePrice: spuDetailSku?.salePrice,
      skuName: spuDetailSku?.skuName,
      show: hasSpuDetail ? spuDetailSku!.show : BoolEnum.TRUE,
      _settlementPrice: contractSku.skuSettlementPrice,
      _stock: contractSku.skuStock,
      _buyLimitNum: contractSku.buyLimitNum,
      _buyLimitType: contractSku.buyLimitType,
      _fold: BoolEnum.FALSE,
    };
    return formSku;
  });
  form._openShareStock = contract?.skuInfoReq?.openSkuStock === BoolEnum.TRUE;
  return form;
}
