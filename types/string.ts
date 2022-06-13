export type AbsoluteUrl = string;
export type Base64 = string;
export type Base64Url = string;
export type Code = string;
export type EmailAddress = string;
export type Guid = string;
export type LowerCase = string;
export type Json = Code;
export type NumberLike = string;
export type PhoneNumber = string;
export type UpperCase = string;

export const DATE_STR = "date";
export const EMAIL = "email";
export const GUID = "guid";
export const NAME = "name";
export const PASSWORD = "password";
export const REGEX = "regex";
export const STRING = "string";
export const URL = "url";
export const USERNAME = "username";

export const STRING_TYPES = [
  DATE_STR,
  EMAIL,
  GUID,
  NAME,
  PASSWORD,
  REGEX,
  STRING,
  URL,
  USERNAME,
] as const;

export type StringType = typeof STRING_TYPES[number];

const EMAIL_EX = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const GUID_EX = /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/;
const PHONE_EX = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
const URL_EX = /^[a-z][a-z0-9+.-]*:/;

export const isAbsoluteUrl = (val: unknown): val is AbsoluteUrl =>
  isString(val) && URL_EX.test(val);

export const isEmailAddress = (val: unknown): val is EmailAddress =>
  isString(val) && EMAIL_EX.test(val);

export const isGuid = (val: unknown): val is Guid =>
  isString(val) && GUID_EX.test(val);

export const isIntegerLike = (val: unknown): val is number =>
  isString(val) && val === String(parseInt(val, 10));

export const isLowerCase = (val: unknown): val is LowerCase =>
  isString(val) && val === val.toLowerCase();

export const isNumberLike = (val: unknown): val is NumberLike =>
  isString(val) && val === String(parseFloat(val));

/*
(123) 456-7890
(123)456-7890
123-456-7890
123.456.7890
1234567890
+31636363634
075-63546725
*/

export const isAlphaNumeric = (val: unknown): val is string => {
  const regExp = /^[A-Za-z0-9]+$/;
  return isString(val) && !!val.match(regExp);
};
export const isPhoneNumber = (val: unknown): val is PhoneNumber =>
  isString(val) && PHONE_EX.test(val);

export const isString = (val: unknown): val is string =>
  val instanceof Object && val.constructor === String ||
  val instanceof String || typeof val === STRING;

export const isUpperCase = (val: unknown): val is UpperCase =>
  isString(val) && val === val.toUpperCase();

export const isValidJSON = (val: unknown): val is Json => {
  if (!isString(val)) {
    return false;
  }
  try {
    JSON.parse(val);
    return true;
  } catch (e) {
    return false;
  }
};

const reWords = /[A-Z\xc0-\xd6\xd8-\xde]?[a-z\xdf-\xf6\xf8-\xff]+(?:['’](?:d|ll|m|re|s|t|ve))?(?=[\xac\xb1\xd7\xf7\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\xbf\u2000-\u206f \t\x0b\f\xa0\ufeff\n\r\u2028\u2029\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000]|[A-Z\xc0-\xd6\xd8-\xde]|$)|(?:[A-Z\xc0-\xd6\xd8-\xde]|[^\ud800-\udfff\xac\xb1\xd7\xf7\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\xbf\u2000-\u206f \t\x0b\f\xa0\ufeff\n\r\u2028\u2029\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\d+\u2700-\u27bfa-z\xdf-\xf6\xf8-\xffA-Z\xc0-\xd6\xd8-\xde])+(?:['’](?:D|LL|M|RE|S|T|VE))?(?=[\xac\xb1\xd7\xf7\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\xbf\u2000-\u206f \t\x0b\f\xa0\ufeff\n\r\u2028\u2029\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000]|[A-Z\xc0-\xd6\xd8-\xde](?:[a-z\xdf-\xf6\xf8-\xff]|[^\ud800-\udfff\xac\xb1\xd7\xf7\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\xbf\u2000-\u206f \t\x0b\f\xa0\ufeff\n\r\u2028\u2029\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\d+\u2700-\u27bfa-z\xdf-\xf6\xf8-\xffA-Z\xc0-\xd6\xd8-\xde])|$)|[A-Z\xc0-\xd6\xd8-\xde]?(?:[a-z\xdf-\xf6\xf8-\xff]|[^\ud800-\udfff\xac\xb1\xd7\xf7\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\xbf\u2000-\u206f \t\x0b\f\xa0\ufeff\n\r\u2028\u2029\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\d+\u2700-\u27bfa-z\xdf-\xf6\xf8-\xffA-Z\xc0-\xd6\xd8-\xde])+(?:['’](?:d|ll|m|re|s|t|ve))?|[A-Z\xc0-\xd6\xd8-\xde]+(?:['’](?:D|LL|M|RE|S|T|VE))?|\d*(?:1ST|2ND|3RD|(?![123])\dTH)(?=\b|[a-z_])|\d*(?:1st|2nd|3rd|(?![123])\dth)(?=\b|[A-Z_])|\d+|(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff])[\ufe0e\ufe0f]?(?:[\u0300-\u036f\ufe20-\ufe2f\u20d0-\u20ff]|\ud83c[\udffb-\udfff])?(?:\u200d(?:[^\ud800-\udfff]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff])[\ufe0e\ufe0f]?(?:[\u0300-\u036f\ufe20-\ufe2f\u20d0-\u20ff]|\ud83c[\udffb-\udfff])?)*/g;

export const words = (str: string): string[] => str.match(reWords) || [];

export const upperFirst = (str: string): string => str[0].toUpperCase() + str.slice(1);

export const join = (str: string, d: string): string => words(str).join(d).toLowerCase();

export const camelCase = (str: string): string =>
  words(str).reduce(
    (acc, next) => `${acc}${!acc ? next : upperFirst(next)}`,
    '',
  );

export const pascalCase = (str: string): string => upperFirst(camelCase(str));

export const snakeCase = (str: string): string => join(str, '_');

export const kebabCase = (str: string): string => join(str, '-');

export const sentenceCase = (str: string): string => upperFirst(join(str, ' '));

export const titleCase = (str: string): string => words(str).map(upperFirst).join(' ');
