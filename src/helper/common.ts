import cloneDeep from 'lodash/cloneDeep';
import isArray from 'lodash/isArray';
import isNil from 'lodash/isNil';
import isObject from 'lodash/isObject';

/**
 * @description 清理所有_开头的私有属性
 */
export function cleanPrivateProperty<T = any>(obj: T): T {
  const copiedObj = cloneDeep(obj);
  Object.keys(copiedObj).forEach(key => {
    if (key.startsWith('_')) {
      delete copiedObj[key];
      return;
    }
    const value = copiedObj[key];
    if (isNil(value)) {
      return;
    }

    if (isArray(value)) {
      copiedObj[key] = value.map(item => {
        if (isObject(item)) {
          return cleanPrivateProperty(item);
        }
        return item;
      });
    }
    if (isObject(value)) {
      copiedObj[key] = cleanPrivateProperty(value);
    }
  });
  return copiedObj;
}

export function getDateFromDateTime(date: DateTimeString): DateString {
  return date.split(' ')[0];
}

// 模糊匹配
export function fuzzyMatch(
  content: string,
  search = '',
  emptyMatch = false,
): boolean {
  let index = -1;
  let flag = false;
  if (!emptyMatch && !search) {
    return true;
  }
  for (let i = 0, arr = search.split(''); i < arr.length; i++) {
    if (content.indexOf(arr[i]) < 0) {
      break;
    } else {
      const reg = new RegExp(arr[i], 'g');
      const match = content.matchAll(reg);
      let next = match.next();
      while (!next.done) {
        if (next.value.index! > index) {
          index = next.value.index!;
          if (i === arr.length - 1) {
            flag = true;
          }
          break;
        }
        next = match.next();
      }
    }
  }
  return flag;
}
