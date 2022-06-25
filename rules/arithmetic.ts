import { ContextualRule, GenericRules, RuleContext } from './types';
import arithmetic from '../expressions/arithmetic';
import supplant, { type Lookup } from '../expressions/supplant';

type ArithmeticParams = Record<string, boolean | number | string>;
type ArithmeticRule = ContextualRule<number, string, ArithmeticParams, RuleContext<GenericRules>>;

const arithmeticRule: ArithmeticRule = (template: string, params, { flags, vars }) => {
  const lookup: Lookup = (key: string): string => {
    const { [key]: val } = params;
    switch (typeof val) {
      case 'boolean':
        return val ? '1' : '0';
      case 'bigint':
        return String(val);
      case 'number':
        return String(val);
      case 'string':
        return val;
      default:
        if (vars.has(key)) {
          return String(vars.get(key));
        }
        if (flags.has(key)) {
          return '1';
        }
        return '0';
    }
  };
  const expr = supplant(template, lookup);
  return arithmetic(expr);
};

export default arithmeticRule;
