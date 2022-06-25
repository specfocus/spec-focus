import type { AnySchema } from '../schemas';

export interface ValidateOptions<TContext = {}> {
  /**
   * Only validate the input, skipping type casting and transformation. Default - false
   */
  strict?: boolean;
  /**
   * Return from validation methods on the first error rather than after all validations run. Default - true
   */
  abortEarly?: boolean;
  /**
   * Remove unspecified keys from objects. Default - false
   */
  stripUnknown?: boolean;
  /**
   * When false validations will not descend into nested schema (relevant for objects or arrays). Default - true
   */
  recursive?: boolean;
  /**
   * Any context needed for validating schema conditions (see: when())
   */
  context?: TContext;
}

export interface InternalOptions<TContext = {}>
  extends ValidateOptions<TContext> {
  __validating?: boolean;
  originalValue?: any;
  parent?: any;
  path?: string;
  sync?: boolean;
  from?: { schema: AnySchema; value: any; }[];
}