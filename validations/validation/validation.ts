import isBoolean from '../../booleans/is-boolean';
import isArray from '../../many/is-array';
import isNumber from '../../numbers/is-number';
import {
  Integer,
  isInteger,
  isNaN,
  isNegativeInteger,
  isNegativeNumber,
  isNonNegativeInteger,
  isNonNegativeNumber,
  isNonPositiveInteger,
  isNonPositiveNumber,
  isNumberOrString,
  isPositiveInteger,
  isPositiveNumber,
  NaN,
  NegativeInteger,
  NegativeNumber,
  NonNegativeInteger,
  NonNegativeNumber,
  NonPositiveInteger,
  NonPositiveNumber,
  NumberOrString,
  PositiveInteger,
  PositiveNumber
} from '../../numbers/number';
import { nameOf2 } from '../../objects/name-of';
import { isNil, isNull, Nil } from '../../maybe';

import isString from '../../strings/is-string';
import {
  AbsoluteUrl,
  EmailAddress,
  Guid,
  isAbsoluteUrl,
  isEmailAddress,
  isGuid,
  isLowerCase,
  isUpperCase,
  LowerCase,
  UpperCase
} from '../../strings/string';

type GlobalDomainName = keyof GlobalDomainRuleMap;

interface GlobalDomainRule<T> {
  name: GlobalDomainName;
  test: (val: unknown) => val is T;
}

class GlobalDomainRuleMap {
  AbsoluteUrl: GlobalDomainRule<AbsoluteUrl> = {
    test: isAbsoluteUrl,
    name: nameOf2<GlobalDomainRuleMap>(o => o.AbsoluteUrl),
  };
  Array: GlobalDomainRule<unknown[]> = {
    test: isArray,
    name: nameOf2<GlobalDomainRuleMap>(o => o.Array),
  };
  Boolean: GlobalDomainRule<boolean> = {
    test: isBoolean,
    name: nameOf2<GlobalDomainRuleMap>(o => o.Boolean),
  };
  EmailAddress: GlobalDomainRule<EmailAddress> = {
    test: isEmailAddress,
    name: nameOf2<GlobalDomainRuleMap>(o => o.EmailAddress),
  };
  Guid: GlobalDomainRule<Guid> = {
    test: isGuid,
    name: nameOf2<GlobalDomainRuleMap>(o => o.Guid),
  };
  Intenger: GlobalDomainRule<Integer> = {
    test: isInteger,
    name: nameOf2<GlobalDomainRuleMap>(o => o.Intenger),
  };
  LowerCase: GlobalDomainRule<LowerCase> = {
    test: isLowerCase,
    name: nameOf2<GlobalDomainRuleMap>(o => o.LowerCase),
  };
  NaN: GlobalDomainRule<NaN> = {
    test: isNaN,
    name: nameOf2<GlobalDomainRuleMap>(o => o.NaN),
  };
  NegativeInteger: GlobalDomainRule<NegativeInteger> = {
    test: isNegativeInteger,
    name: nameOf2<GlobalDomainRuleMap>(o => o.NegativeInteger),
  };
  NegativeNumber: GlobalDomainRule<NegativeNumber> = {
    test: isNegativeNumber,
    name: nameOf2<GlobalDomainRuleMap>(o => o.NegativeNumber),
  };
  Nil: GlobalDomainRule<Nil> = {
    test: isNil,
    name: nameOf2<GlobalDomainRuleMap>(o => o.Nil),
  };
  NonNevativeInteger: GlobalDomainRule<NonNegativeInteger> = {
    test: isNonNegativeInteger,
    name: nameOf2<GlobalDomainRuleMap>(o => o.NonNevativeInteger),
  };
  NonNevativeNumber: GlobalDomainRule<NonNegativeNumber> = {
    test: isNonNegativeNumber,
    name: nameOf2<GlobalDomainRuleMap>(o => o.NonNevativeNumber),
  };
  NonPositiveInteger: GlobalDomainRule<NonPositiveInteger> = {
    test: isNonPositiveInteger,
    name: nameOf2<GlobalDomainRuleMap>(o => o.NonPositiveInteger),
  };
  NonPositiveNumber: GlobalDomainRule<NonPositiveNumber> = {
    test: isNonPositiveNumber,
    name: nameOf2<GlobalDomainRuleMap>(o => o.NonPositiveNumber),
  };
  Null: GlobalDomainRule<null> = {
    test: isNull,
    name: nameOf2<GlobalDomainRuleMap>(o => o.Null),
  };
  Number: GlobalDomainRule<number> = {
    test: isNumber,
    name: nameOf2<GlobalDomainRuleMap>(o => o.Number),
  };
  NumberOrString: GlobalDomainRule<NumberOrString> = {
    test: isNumberOrString,
    name: nameOf2<GlobalDomainRuleMap>(o => o.NumberOrString),
  };
  PositiveInteger: GlobalDomainRule<PositiveInteger> = {
    test: isPositiveInteger,
    name: nameOf2<GlobalDomainRuleMap>(o => o.PositiveInteger),
  };
  PositiveNumber: GlobalDomainRule<PositiveNumber> = {
    test: isPositiveNumber,
    name: nameOf2<GlobalDomainRuleMap>(o => o.PositiveNumber),
  };
  String: GlobalDomainRule<string> = {
    test: isString,
    name: nameOf2<GlobalDomainRuleMap>(o => o.String),
  };
  UpperCase: GlobalDomainRule<UpperCase> = {
    test: isUpperCase,
    name: nameOf2<GlobalDomainRuleMap>(o => o.UpperCase),
  };
}

const _map = Object.freeze(new GlobalDomainRuleMap());
const _keys = Object.freeze(
  Object.keys(_map).sort()
) as readonly GlobalDomainName[];
const _values = Object.freeze(_keys.map(k => _map[k]));

export function ruleFor<T>(
  ruleFunction: (obj: GlobalDomainRuleMap) => GlobalDomainRule<T>
): GlobalDomainRule<T> {
  throw new Error('Not implemented');
  // return <GlobalDomainRule<T>>_map[nameOf<GlobalDomainRuleMap>(ruleFunction)];
}

/*
ruleFor<AbsoluteUrl>(o => o.AbsoluteUrl);
ruleFor<String>((o) => o.AbsoluteUrl);
ruleFor<AbsoluteUrl>((o) => o.String);
*/

export class GlobalDomain {
  static has = (key: string): boolean => key in GlobalDomainRuleMap;
  static test = (name: GlobalDomainName, val: unknown): boolean =>
    _map[name]?.test(val);
  static map = _map;
  static all = _values;
}
