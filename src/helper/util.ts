import moment, {Moment} from 'moment';
import {DATE_TIME_FORMAT} from '../constants';
import {Environment, DateTimeString, FormMerchant, MerchantForm, MerchantCreateType, UploadFile, SPUCategory, SPUCodeType, ShopForm, SKUBuyNoticeF, Notice} from '../models';

// 用来模拟异步操作
export async function wait(ms: number) {
  return new Promise(resolve => setTimeout(() => resolve(null), ms));
}

// 如果后续添加环境，在这里统一配置，项目内判断环境统一用这个入口
export function getEnv(): Environment {
  return __DEV__ ? 'development' : 'production';
}

export function isNumberString(numLike: string) {
  return /^\d+$/.test(numLike);
}

export function getNumberValue(numString: string) {
  if (isNumberString(numString)) {
    return Number(numString);
  }
}

// 从数组安全的获取指定索引的元素
export function getItemByIndex<T>(list: T[], index: number): T | undefined {
  list = list || [];
  return list[index];
}
// 从数组安全的获取指定元素
export function findItem<T>(list: T[], predicate: (item: T) => boolean): T | null {
  list = list || [];
  return list.find(predicate)!;
}

// 格式化时间
export function formatMoment(moment: Moment) {
  if (!moment) {
    return null;
  }
  return moment.format(DATE_TIME_FORMAT);
}

export function momentFromDateTime(timeStr: DateTimeString) {
  return moment(timeStr, DATE_TIME_FORMAT);
}

// 网上找的。测了100以内的数字，无错误
export function convertNumber2Han(num: number): string {
  const arr1 = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
  const arr2 = ['', '十', '百', '千', '万', '十', '百', '千', '亿', '十', '百', '千', '万', '十', '百', '千', '亿'];
  if (!num || isNaN(num)) {
    return '零';
  }
  const english = num
    .toString()
    .split('')
    .map(a => Number(a));
  let result = '';
  for (let i = 0; i < english.length; i++) {
    const des_i = english.length - 1 - i; // 倒序排列设值
    result = arr2[i] + result;
    const arr1_index = english[des_i];
    result = arr1[arr1_index] + result;
  }
  result = result.replace(/零(千|百|十)/g, '零').replace(/十零/g, '十'); // 将【零千、零百】换成【零】 【十零】换成【十】
  result = result.replace(/零+/g, '零'); // 合并中间多个零为一个零
  result = result.replace(/零亿/g, '亿').replace(/零万/g, '万'); // 将【零亿】换成【亿】【零万】换成【万】
  result = result.replace(/亿万/g, '亿'); // 将【亿万】换成【亿】
  result = result.replace(/零+$/, ''); // 移除末尾的零
  // 将【一十】换成【十】
  result = result.replace(/^一十/g, '十');
  return result;
}

export function flattenTree<T>(tree: any[], childrenKey: string = 'children'): T[] {
  const result: T[] = [];
  tree.forEach(item => {
    result.push(item);
    const children = item[childrenKey];
    if (children?.length) {
      const flattenChildren = flattenTree(item[childrenKey], childrenKey) as T[];
      result.push(...flattenChildren);
    }
  });
  return result;
}

// 格式化商家发送请求的数据
export function formattingMerchantRequest(data: FormMerchant, type: MerchantCreateType) {
  const {avatar, businessLicense} = data;
  const newData: MerchantForm = {...data, avatar: avatar[0].url, businessLicense: businessLicense[0].url, type, locationWithCompanyId: 19};
  return newData;
}

//格式化商家用于编辑和查看的数据
export function formattingMerchantEdit(data: MerchantForm) {
  const {avatar, businessLicense, areaInfo = []} = data;
  const newAvatar: UploadFile[] = [{url: avatar, uid: avatar}];
  const newBusinessLicense: UploadFile[] = [{url: businessLicense, uid: businessLicense}];
  const newData: FormMerchant = {...data, businessLicense: newBusinessLicense, avatar: newAvatar, areaInfo};
  return newData;
}

//格式化商品分类的数据
export function formattingGoodsCategory(list: SPUCategory[]) {
  return list.map(item => {
    let children;
    if (item.children) {
      children = item.children.map(element => {
        let children;
        if (element.children) {
          children = element.children.map(e => {
            return {
              label: e.name,
              value: e.id,
              children: e.children,
            };
          });
        }
        return {
          label: element.name,
          value: element.id,
          children,
        };
      });
    }
    return {
      label: item.name,
      value: item.id,
      children,
    };
  });
}
//格式化发码方式数据
export function formattingCodeType(data: SPUCodeType[]) {
  return data.map(item => {
    return {
      label: item.name,
      value: item.codeType,
    };
  });
}

//格式化新建商品的数据
export function cleanSPUForm(formData: any) {
  const form = {...formData};
  form.saleBeginTime = formatMoment(form?.saleBeginTime);
  form.saleEndTime = formatMoment(form?.saleEndTime);
  form.showBeginTime = formatMoment(form?.showBeginTime);
  form.canUseShopIds = form?.canUseShopIds?.map((item: ShopForm) => item.id);
  form.poster = formData?.poster[0]?.url;
  delete form.spuStock;
  form.skuList.forEach((_, index: number) => {
    delete _.skuSettlementPrice;
    form.skuList[index].list = form.skuList[index].skuDetails;
    delete form.skuList[index].skuDetails;
  });
  form.skuList?.forEach((item: any) => {
    item.show = 1;
    delete item.buyLimitNum;
    delete item.buyLimitType;
  });
  form?.packageList?.forEach((item: any) => {
    item?.skus?.forEach((item: any) => {
      delete item._selected;
      delete item._skuName;
      delete item.skuSettlementPrice;
    });
  });
  form.bannerPhotos = form?.bannerPhotos?.map((item: any) => ({url: item.url, id: item.id}));
  return form;
}

export const cleanNotice = (value: SKUBuyNoticeF[]) => {
  const _notice: Notice = {
    BOOKING: [],
    SALE_TIME: [],
    USE_RULE: [],
    POLICY: [],
    TIPS: [],
  };
  console.log('原始数据', value);
  value?.forEach(item => {
    switch (item.type) {
      case 'BOOKING':
        _notice.BOOKING.push(item);
        break;
      case 'SALE_TIME':
        _notice.SALE_TIME.push(item);
        break;
      case 'USE_RULE':
        _notice.USE_RULE.push(item);
        break;
      case 'TIPS':
        _notice.TIPS.push(item);
        break;
      case 'POLICY':
        _notice.POLICY.push(item);
        break;
    }
  });
  return _notice;
};
