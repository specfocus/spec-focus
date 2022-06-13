import { isObject } from './object';

export declare type SimpleValue = bigint | Date | number | string | boolean;

export declare type SimpleArray = (SimpleType | undefined)[];

export declare type SimpleTuple = [SimpleType, ...SimpleType[]];

export declare type SimpleType = SimpleArray | SimpleObject | SimpleTuple | SimpleValue | null | undefined;

export declare interface SimpleObject extends Record<string, SimpleType> {
}

export const isSimpleBoolean = (val: unknown): val is boolean =>
  typeof val === 'boolean';

export const isSimpleNumber = (val: unknown): val is number =>
  typeof val === 'number';

export const isSimpleObject = (val: unknown): val is SimpleObject => {
  if (!isObject(val)) {
    return false;
  }

  return !Object.values(val).some(val => !isSimpleType(val));
};

export const isSimpleString = (val: unknown): val is string =>
  typeof val === 'string';

export const isSimpleType = (val: unknown): val is SimpleType => {
  switch (val) {
    case NaN:
      return true;
    case null:
      return true;
  }
  switch (typeof val) {
    case 'bigint':
    case 'boolean':
    case 'number':
    case 'string':
    case 'undefined':
      return true;
    case 'function':
    case 'symbol':
      return false;
    case 'object':
      if (val === null) {
        return true;
      }
      if (Array.isArray(val)) {
        return !val.some(item => !isSimpleType(item));
      }
      switch (val.constructor) {
        case Boolean:
        case Date:
        case Number:
        case String:
          return true;
        default:
          return !Object.values(val).some(val => !isSimpleType(val));
      }
    default:
      throw 'not implemented';
  }
};

export const isSimpleValue = (val: unknown): val is boolean | number | string =>
  typeof val === 'boolean' || typeof val === 'number' || typeof val === 'string';