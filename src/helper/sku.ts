import {isNil, uniqueId} from 'lodash';
import {cleanPrivateProperty} from './common';
import {findItem, formatMoment, momentFromDateTime} from './util';
import {BoolEnum, ContractDetailF, SKUBuyNotice, SKUBuyNoticeF, SKUBuyNoticeType, SPUDetailF, SPUForm, SKU, PackagedSKUItem} from '../models';

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

function convertToBuyNotice(type: SKUBuyNoticeType, contents: string[] = []): SKUBuyNoticeF[] {
  return contents.map(content => {
    return {
      type,
      content,
    };
  });
}

export function cleanSPUForm(spu: SPUForm): SPUForm {
  const newSPU = {...spu};

  // web处理售卖时间
  const {_saleTime} = spu;
  if (_saleTime && _saleTime.length) {
    const [saleBeginTime, saleEndTime] = _saleTime.map(formatMoment);
    newSPU.saleBeginTime = saleBeginTime!;
    newSPU.saleEndTime = saleEndTime!;
  }
  newSPU.bannerPhotos = newSPU?.bannerPhotos?.map(item => ({url: item.url}));
  // rn处理售卖时间
  const {_saleBeginTime, _saleEndTime} = spu;
  if (_saleBeginTime && _saleEndTime) {
    newSPU.saleBeginTime = formatMoment(_saleBeginTime);
    newSPU.saleEndTime = formatMoment(_saleEndTime);
  }

  const {_showBeginTime} = spu;
  newSPU.showBeginTime = formatMoment(_showBeginTime);

  const {_bookingNotice, _policyNotice, _tipsNotice, _useRuleNotice, _saleTimeNotice} = newSPU;
  newSPU.purchaseNoticeEntities = [
    ...convertToBuyNotice('BOOKING', _bookingNotice),
    ...convertToBuyNotice('SALE_TIME', _saleTimeNotice),
    ...convertToBuyNotice('USE_RULE', _useRuleNotice),
    ...convertToBuyNotice('TIPS', _tipsNotice),
    ...convertToBuyNotice('POLICY', _policyNotice),
  ];

  const {_poster} = spu;
  newSPU.poster = _poster?.[0]?.url;

  return cleanPrivateProperty(newSPU);
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
    _saleBeginTime: undefined,
    saleEndTime: undefined,
    _saleEndTime: undefined,
    _saleTime: undefined,
    baseShareCount: Math.floor(Math.random() * 100),
    skuList: [],
    spuHtml: '',
    spuName: '',
    stockAmount: Math.floor(Math.random() * 10000),
    useBeginTime: undefined,
    useEndTime: undefined,
    _useBeginTime: undefined,
    _useEndTime: undefined,
    _useTime: undefined,
    showBeginTime: undefined,
    _showBeginTime: undefined,
  };
}

export function generateSPUForm(contract: ContractDetailF, spuDetail?: SPUDetailF): Partial<SPUForm> {
  const form: Partial<SPUForm> = {};

  const {saleBeginTime, saleEndTime, useBeginTime, useEndTime, showBeginTime} = spuDetail || {};
  if (saleBeginTime && saleEndTime) {
    form._saleBeginTime = momentFromDateTime(saleBeginTime);
    form._saleEndTime = momentFromDateTime(saleEndTime);
    form._saleTime = [form._saleBeginTime, form._saleEndTime];
  }
  if (useBeginTime && useEndTime) {
    form._useBeginTime = momentFromDateTime(useBeginTime);
    form._useEndTime = momentFromDateTime(useEndTime);
    form._useTime = [form._useBeginTime, form._useEndTime];
  }
  if (showBeginTime) {
    form._showBeginTime = momentFromDateTime(showBeginTime);
  }

  form.skuList = contract.skuInfoReq?.skuInfo?.map(contractSku => {
    const spuDetailSku = findItem(spuDetail?.skuList!, sku => sku.contractSkuId === contractSku.contractSkuId);
    const hasSpuDetail = !isNil(spuDetailSku);
    const formSku: SKU = {
      contractSkuId: contractSku.contractSkuId,
      skuId: spuDetailSku?.skuId,
      list: contractSku.skuDetails,
      originPrice: spuDetailSku?.originPrice,
      salePrice: spuDetailSku?.salePrice,
      skuName: contractSku?.skuName,
      show: hasSpuDetail ? spuDetailSku!.show : BoolEnum.TRUE,
      _settlementPrice: contractSku.skuSettlementPrice,
      _stock: contractSku.skuStock,
      skuStock: 0,
      _buyLimitNum: contractSku.buyLimitNum,
      _buyLimitType: contractSku.buyLimitType,
      _fold: BoolEnum.FALSE,
    };
    return formSku;
  });

  const detailSKUList = spuDetail?.skuList || [];
  form.packageList = spuDetail?.packageList?.map(skuPackage => {
    const packSKUList: PackagedSKUItem[] = skuPackage.skus.map(packageSKU => {
      const sku = findItem(detailSKUList, sku => sku.skuId === packageSKU.skuId);
      return {...packageSKU, contractSkuId: sku?.contractSkuId};
    });
    return {...skuPackage, skus: packSKUList};
  });

  form._openShareStock = contract?.skuInfoReq?.openSkuStock === BoolEnum.TRUE;
  // rn需要处理图片
  const {bannerPhotos, poster} = spuDetail || {};
  form.bannerPhotos =
    bannerPhotos?.map(photo => {
      return {
        url: photo.url,
        uid: photo.id || uniqueId(),
      };
    }) || [];

  if (poster) {
    form._poster = [{url: poster, uid: uniqueId()}];
  } else {
    form._poster = [];
  }

  return form;
}

export function getDirectCommissionRange(maxCommission: number, earnCommission = 0): [number, number] {
  const min = 2;
  let max = maxCommission - 2;
  if (earnCommission && earnCommission < Math.floor(maxCommission / 2)) {
    // 超过一半最大佣金的躺赚佣金是无意义的
    max = Math.min(maxCommission - earnCommission * 2);
  }
  // min = Math.max(min, maxCommission - Math.floor(maxCommission / 4) * 2);
  if (max < min) {
    max = min;
  }
  return [min, max];
}

export function getEarnCommissionRange(maxCommission: number, directCommission = 0): [number, number] {
  let max = Math.floor(maxCommission / 4);
  if (directCommission && directCommission < maxCommission) {
    // 超过最大佣金的直售佣金是无意义的
    const value = Math.floor((maxCommission - directCommission) / 2);
    max = Math.min(max, value);
  }
  if (max < 1) {
    max = 1;
  }
  return [1, max];
}
