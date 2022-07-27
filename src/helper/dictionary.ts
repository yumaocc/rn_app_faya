import {BookingType} from '../models';

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
