// <reference types="../../typings/number" />
// <reference types="../../typings/record" />
// <reference types="../../typings/string" />

import { nameOf } from "./reflection/nameof";
import { isArray } from "./array";
import { isBoolean } from "./boolean";
import { Nil } from './maybe';
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
  isNumber,
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
  PositiveNumber,
} from "./number";
import { isNil, isNull } from "./maybe";

import {
  AbsoluteUrl,
  EmailAddress,
  Guid,
  isAbsoluteUrl,
  isEmailAddress,
  isGuid,
  isLowerCase,
  isString,
  isUpperCase,
  LowerCase,
  UpperCase,
} from "./string";

type GlobalDomainName = keyof GlobalDomainRuleMap;

interface GlobalDomainRule<T> {
  name: GlobalDomainName;
  test: (val: unknown) => val is T;
}

class GlobalDomainRuleMap {
  AbsoluteUrl: GlobalDomainRule<AbsoluteUrl> = {
    test: isAbsoluteUrl,
    name: nameOf<GlobalDomainRuleMap>(o => o.AbsoluteUrl),
  };
  Array: GlobalDomainRule<unknown[]> = {
    test: isArray,
    name: nameOf<GlobalDomainRuleMap>(o => o.Array),
  };
  Boolean: GlobalDomainRule<boolean> = {
    test: isBoolean,
    name: nameOf<GlobalDomainRuleMap>(o => o.Boolean),
  };
  EmailAddress: GlobalDomainRule<EmailAddress> = {
    test: isEmailAddress,
    name: nameOf<GlobalDomainRuleMap>(o => o.EmailAddress),
  };
  Guid: GlobalDomainRule<Guid> = {
    test: isGuid,
    name: nameOf<GlobalDomainRuleMap>(o => o.Guid),
  };
  Intenger: GlobalDomainRule<Integer> = {
    test: isInteger,
    name: nameOf<GlobalDomainRuleMap>(o => o.Intenger),
  };
  LowerCase: GlobalDomainRule<LowerCase> = {
    test: isLowerCase,
    name: nameOf<GlobalDomainRuleMap>(o => o.LowerCase),
  };
  NaN: GlobalDomainRule<NaN> = {
    test: isNaN,
    name: nameOf<GlobalDomainRuleMap>(o => o.NaN),
  };
  NegativeInteger: GlobalDomainRule<NegativeInteger> = {
    test: isNegativeInteger,
    name: nameOf<GlobalDomainRuleMap>(o => o.NegativeInteger),
  };
  NegativeNumber: GlobalDomainRule<NegativeNumber> = {
    test: isNegativeNumber,
    name: nameOf<GlobalDomainRuleMap>(o => o.NegativeNumber),
  };
  Nil: GlobalDomainRule<Nil> = {
    test: isNil,
    name: nameOf<GlobalDomainRuleMap>(o => o.Nil),
  };
  NonNevativeInteger: GlobalDomainRule<NonNegativeInteger> = {
    test: isNonNegativeInteger,
    name: nameOf<GlobalDomainRuleMap>(o => o.NonNevativeInteger),
  };
  NonNevativeNumber: GlobalDomainRule<NonNegativeNumber> = {
    test: isNonNegativeNumber,
    name: nameOf<GlobalDomainRuleMap>(o => o.NonNevativeNumber),
  };
  NonPositiveInteger: GlobalDomainRule<NonPositiveInteger> = {
    test: isNonPositiveInteger,
    name: nameOf<GlobalDomainRuleMap>(o => o.NonPositiveInteger),
  };
  NonPositiveNumber: GlobalDomainRule<NonPositiveNumber> = {
    test: isNonPositiveNumber,
    name: nameOf<GlobalDomainRuleMap>(o => o.NonPositiveNumber),
  };
  Null: GlobalDomainRule<null> = {
    test: isNull,
    name: nameOf<GlobalDomainRuleMap>(o => o.Null),
  };
  Number: GlobalDomainRule<number> = {
    test: isNumber,
    name: nameOf<GlobalDomainRuleMap>(o => o.Number),
  };
  NumberOrString: GlobalDomainRule<NumberOrString> = {
    test: isNumberOrString,
    name: nameOf<GlobalDomainRuleMap>(o => o.NumberOrString),
  };
  PositiveInteger: GlobalDomainRule<PositiveInteger> = {
    test: isPositiveInteger,
    name: nameOf<GlobalDomainRuleMap>(o => o.PositiveInteger),
  };
  PositiveNumber: GlobalDomainRule<PositiveNumber> = {
    test: isPositiveNumber,
    name: nameOf<GlobalDomainRuleMap>(o => o.PositiveNumber),
  };
  String: GlobalDomainRule<string> = {
    test: isString,
    name: nameOf<GlobalDomainRuleMap>(o => o.String),
  };
  UpperCase: GlobalDomainRule<UpperCase> = {
    test: isUpperCase,
    name: nameOf<GlobalDomainRuleMap>(o => o.UpperCase),
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
  throw new Error("Not implemented");
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
