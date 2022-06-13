export type ConstantRule<Output> = () => Output;
export type SimpleRule<Output, Input> = (input: Input) => Output;
export type ParameterizedRule<Output, Input, Params> = (input: Input, params: Params) => Output;
export type ContextualRule<
  Output,
  Input,
  Params extends {},
  Context extends RuleContext<GenericRules>
> = (
  input: Input,
  params: Params,
  context: Context
) => Output;
export type Rule<
  Output,
  Input,
  Params extends {},
  Context extends RuleContext<GenericRules>
> =
  | ConstantRule<Output>
  | SimpleRule<Output, Input>
  | ParameterizedRule<Output, Input, Params>
  | ContextualRule<Output, Input, Params, Context>;

export type GenericRules = Record<string, Rule<any, any, any, any>>;

export interface RuleContext<Rules extends GenericRules> {
  readonly flags: ReadonlySet<string>;
  readonly rules: Readonly<Rules>;
  readonly vars: ReadonlyMap<string, number | string>;

  /**
   * asserts value from vars exists and is of number type
   */
   readonly numbers: (key: string) => number;

  /**
   * asserts value from vars exists and is of string type
   */
  readonly strings: (key: string) => string;
}
