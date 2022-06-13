import { ObjectSchema } from './schema/ObjectSchema';
// import type { Unit } from './unit';

export const BOOLEAN_DOMAIN_TYPE = 'boolean';
export const NUMBER_DOMAIN_TYPE = 'number';
export const STRING_DOMAIN_TYPE = 'string';
export const DOMAIN_TYPES = [
  BOOLEAN_DOMAIN_TYPE,
  NUMBER_DOMAIN_TYPE,
  STRING_DOMAIN_TYPE
] as const;

export type Domain = BooleanDomain | NumberDomain | StringDomain;
export type DomainType = typeof DOMAIN_TYPES[number];
export type DomainValue<T extends number | string> = T | {};
export type DomainValues<T extends number | string> = DomainValue<T>[] | { [key: number | string]: DomainValue<T>; };

export interface BooleanDomain {
  type: typeof BOOLEAN_DOMAIN_TYPE;
}

export interface DateDomain extends StringDomain {
  format: 'date' | 'date-time' | 'duration' | 'time';
}

export interface IntegerDomain extends Omit<NumberDomain, 'integer'> {
  integer: true;
}

export interface NumberDomain {
  base?: string; // base domain
  // factor?: number;
  integer?: true;
  reference?: string;
  type: typeof NUMBER_DOMAIN_TYPE;
  // unit?: Unit;
  values?: DomainValues<number>;
}

export interface StringDomain {
  base?: string; // base domain
  format?: string;
  mask?: string;
  reference?: string;
  schema?: ObjectSchema;
  type: typeof STRING_DOMAIN_TYPE;
  variant?: string; // if a group of regions, this is the name of the country
  values?: DomainValues<string>;
}
