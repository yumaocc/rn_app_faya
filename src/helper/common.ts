import cloneDeep from 'lodash/cloneDeep';
import isArray from 'lodash/isArray';
import isNil from 'lodash/isNil';
import isObject from 'lodash/isObject';
import {DateTimeString, DateString} from '../models';

// 清理模糊匹配的输入
function reshapeInput(
  query: string,
  source: string,
  opts: {
    caseSensitive?: boolean;
  },
): [string, string] {
  if (typeof query !== 'string') {
    throw new TypeError('Expecting query to be a string');
  }

  if (typeof source !== 'string') {
    throw new TypeError('Expecting source to be a string');
  }

  let reshapedQuery = query.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  let reshapedSource = source.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  if (!opts.caseSensitive) {
    reshapedQuery = reshapedQuery.toLowerCase();
    reshapedSource = reshapedSource.toLowerCase();
  }

  return [reshapedQuery, reshapedSource];
}

// 模糊匹配。算法来自[这里](https://github.com/gjuchault/fuzzyjs)
export function fuzzyMatch(
  source: string,
  query: string,
  opts: {caseSensitive?: boolean} = {},
): boolean {
  const [reshapedQuery, reshapedSource] = reshapeInput(query, source, opts);

  // if no source, then only return true if query is also empty
  if (!reshapedSource.length) {
    return !query.length;
  }

  if (!reshapedQuery.length) {
    return true;
  }

  // a bigger query than source will always return false
  if (reshapedQuery.length > reshapedSource.length) {
    return false;
  }

  let queryPos = 0;
  let sourcePos = 0;

  // loop on source string
  while (sourcePos < source.length) {
    const actualSourceCharacter = reshapedSource[sourcePos];
    const queryCharacterWaitingForMatch = reshapedQuery[queryPos];

    // if actual query character matches source character
    if (actualSourceCharacter === queryCharacterWaitingForMatch) {
      // move query pos
      queryPos += 1;
    }

    sourcePos += 1;
  }

  return queryPos === reshapedQuery.length;
}

/**
 * @description 清理所有_开头的私有属性
 */
export function cleanPrivateProperty<T = any>(obj: T): T {
  const copiedObj = cloneDeep(obj) as {[key: string]: any};
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
  return copiedObj as T;
}

export function getDateFromDateTime(date: DateTimeString): DateString {
  return date.split(' ')[0];
}
