import assert, { assertNumber, assertString } from './assert';
import { GenericRules, RuleContext } from './types';

const VARIABLE_404 = 'ASSERT_404';
const VARIABLE_400_NUMBER = 'ASSERT_400_NUMBER';
const VARIABLE_400_STRING = 'ASSERT_400_STRING';

export interface RulesContextData<Rules extends GenericRules> {
  flags: string[];
  rules: Rules;
  vars: Record<string, number | string>;
}

export type Require<Dependencies extends {}> = <Name extends keyof Dependencies>(name: Name) => Dependencies[Name];

const freeze = <
  Rules extends GenericRules,
  Dependencies extends {} = {}
>(
  data: RulesContextData<Rules>,
  require: Require<Dependencies>
): RuleContext<Rules> => {
  const flags = Object.freeze(new Set<string>(data.flags));
  const rules = Object.freeze({ ...data.rules });
  const vars = Object.freeze(new Map<string, number | string>(Object.entries(data.vars)));
  const immutable = Object.freeze({
    flags,
    rules,
    vars,
    numbers: (key: string): number => {
      assert(vars.has(key), VARIABLE_404);
      const val = Number(vars.get(key));
      assertNumber(val, VARIABLE_400_NUMBER);
      return val;
    },
    require,
    strings: (key: string): string => {
      assert(vars.has(key), VARIABLE_404);
      const val = String(vars.get(key));
      assertString(val, VARIABLE_400_STRING);
      return val;
    }
  });
  return immutable;
};

export default freeze;
