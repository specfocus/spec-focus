/**
 * Based on Kendo UI Core expression code <https://github.com/telerik/kendo-ui-core#license-information>
 */
export class Cache {
  _maxSize: number;
  _values!: Record<string, any>;
  _size: number = 0;

  constructor(maxSize: number) {
    this._maxSize = maxSize;
    this.clear();
  }
  clear = () => {
    this._size = 0;
    this._values = Object.create(null);
  };
  get = (key: string) => {
    return this._values[key];
  };
  set = (key: string, value: any) => {
    this._size >= this._maxSize && this.clear();
    if (!(key in this._values)) this._size++;

    return (this._values[key] = value);
  };
}

const SPLIT_REGEX = /[^.^\]^[]+|(?=\[\]|\.\.)/g;
const DIGIT_REGEX = /^\d+$/;
const LEAD_DIGIT_REGEX = /^\d/;
const SPEC_CHAR_REGEX = /[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g;
const CLEAN_QUOTES_REGEX = /^\s*(['"]?)(.*?)(\1)\s*$/;
const MAX_CACHE_SIZE = 512;

const pathCache = new Cache(MAX_CACHE_SIZE);
const setCache = new Cache(MAX_CACHE_SIZE);
const getCache = new Cache(MAX_CACHE_SIZE);

type Callback = (part: string, isBracket: boolean, isArray: boolean, idx: number, parts: string[]) => void

export const setter = (path: string) => {
  const parts = normalizePath(path);

  return (
    setCache.get(path) ||
    setCache.set(path, (obj: Record<string, any>, value: any): Record<string, any> | undefined => {
      const len = parts.length;
      let index = 0;
      let data = obj;
      while (index < len - 1) {
        const part = parts[index];
        if (
          part === '__proto__' ||
          part === 'constructor' ||
          part === 'prototype'
        ) {
          return obj;
        }

        data = data[parts[index++]];
      }
      data[parts[index]] = value;
    })
  );
};

export const getter = (path: string, safe?: boolean) => {
  const parts = normalizePath(path);
  return (
    getCache.get(path) ||
    getCache.set(path, (data: Record<string, any>) => {
      let index = 0,
        len = parts.length;
      while (index < len) {
        if (data != null || !safe) data = data[parts[index++]];
        else return;
      }
      return data;
    })
  );
};

export const join = (segments: string[]): string => {
  return segments.reduce(function (path, part) {
    return (
      path +
      (isQuoted(part) || DIGIT_REGEX.test(part)
        ? '[' + part + ']'
        : (path ? '.' : '') + part)
    );
  }, '');
};

export const forEach = (path: string | string[], cb: Callback, thisArg?: any) => {
  _forEach(Array.isArray(path) ? path : split(path), cb, thisArg);
};

export const normalizePath = (path: string): any =>
  pathCache.get(path) ||
  pathCache.set(
    path,
    split(path).map((part) => {
      return part.replace(CLEAN_QUOTES_REGEX, '$2');
    })
  );

export const split = (path: string): string[] => path.match(SPLIT_REGEX)!;

function _forEach(parts: string[], iter: Callback, thisArg: any) {
  for (let idx = 0, len = parts.length; idx < len; idx++) {
    let part = parts[idx];

    if (part) {
      if (shouldBeQuoted(part)) {
        part = '"' + part + '"';
      }

      const isBracket = isQuoted(part);
      const isArray = !isBracket && /^\d+$/.test(part);

      iter.call(thisArg, part, isBracket, isArray, idx, parts);
    }
  }
}

const isQuoted = (str: string): boolean =>
  typeof str === 'string' && str.length > 0 && ["'", '"'].indexOf(str.charAt(0)) !== -1;

const hasLeadingNumber = (part: string): boolean =>
  part.match(LEAD_DIGIT_REGEX) !== null && part.match(DIGIT_REGEX) === null;

const hasSpecialChars = (part: string): boolean => SPEC_CHAR_REGEX.test(part);

const shouldBeQuoted = (part: string): boolean =>
  !isQuoted(part) && (hasLeadingNumber(part) || hasSpecialChars(part));