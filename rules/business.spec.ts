import multiplication from './multiplication';
import one from './one';
import summation from './summation';
import { RuleContext } from './types';
import zero from './zero';
import freeze from './freeze';

export type {
  ConstantRule,
  ContextualRule,
  Rule,
  SimpleRule as SimpleRule
} from './types';

const progress = (input: number, { offset = 0 }, ctx: BusinessContext) => {
  const increment = ctx.rules.multiplication([input, ctx.numbers('factor')]);
  const result = ctx.rules.summation([offset, increment]);
  return result;
}

const RULES = {
  one,
  multiplication,
  summation,
  zero,
  progress
};

type Rules = typeof RULES;
type BusinessContext = RuleContext<Rules>;
type RuleNames = keyof Rules;

const data = {
  flags: [],
  rules: RULES,
  vars: { 'factor': 10 }
};
const ctx = freeze<Rules>({
  flags: [],
  rules: RULES,
  vars: { 'factor': 10 }
});

describe('constracts should work by default', () => {
  it('should error if we try to modify a rule after the rules are frozen', () => {
    // @ts-ignore
    const change = jest.fn(() => ctx.rules.zero = () => 10);
    expect(change).toThrow(`Cannot assign to read only property 'zero' of object '#<Object>'`);
  });

  it('should zero return 0', () => {
    expect(RULES.zero()).toBe(0);
  });

  it('should one return 1', () => {
    expect(ctx.rules.one()).toBe(1);
  });

  it('should multiply correctly', () => {
    expect(ctx.rules.multiplication([1, 2, 3])).toBe(6);
  });

  it('should sum correctly', () => {
    expect(ctx.rules.summation([1, 2, 3])).toBe(6);
  });

  it('should progress correctly', () => {
    expect(ctx.rules.progress(3, { offset: 20 }, ctx)).toBe(50);
  });
});
