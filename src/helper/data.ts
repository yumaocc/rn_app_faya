import {isNil} from 'lodash';

export function numberToString(num: number) {
  if (isNil(num)) {
    return '';
  }
  return String(num);
}

export function stringToNumber(str: string) {
  return Number(str.replace(/\.$/, ''));
}
