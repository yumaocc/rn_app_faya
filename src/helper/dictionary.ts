import {BookingType, BuyLimitType, SKUBuyNoticeType} from '../models';

export function getBookingType(type: BookingType) {
  switch (type) {
    case BookingType.NONE:
      return '无需预约';
    case BookingType.PHONE:
      return '电话预约';
    case BookingType.URL:
      return '网址预约';
    default:
      return '';
  }
}

export function getBuyLimitStr(buyLimitType: BuyLimitType, buyLimitNum: number | string) {
  switch (buyLimitType) {
    case BuyLimitType.NONE:
      return '不限购';
    case BuyLimitType.PHONE:
      return `1个手机号限购${buyLimitNum}份`;
    case BuyLimitType.ID_CARD:
      return `1张身份证限购${buyLimitNum}份`;
    default:
      return '-';
  }
}

export function getBuyNoticeTitle(type: SKUBuyNoticeType) {
  switch (type) {
    case 'BOOKING':
      return '预约须知';
    case 'SALE_TIME':
      return '营业时间';
    case 'USE_RULE':
      return '使用规则';
    case 'POLICY':
      return '取消政策';
    case 'TIPS':
      return '温馨提示';
  }
}
