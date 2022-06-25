import type { ExtraParams } from '../messages';

export interface SchemaDescription {
  type: string;
  label?: string;
  meta: object | undefined;
  oneOf: unknown[];
  notOneOf: unknown[];
  nullable: boolean;
  optional: boolean;
  tests: { name?: string; params: ExtraParams | undefined; }[];
}

export type SchemaFieldDescription =
  | SchemaDescription
  | SchemaRefDescription
  | SchemaObjectDescription
  | SchemaInnerTypeDescription
  | SchemaLazyDescription;


export interface SchemaInnerTypeDescription extends SchemaDescription {
  innerType?: SchemaFieldDescription;
}

export interface SchemaLazyDescription {
  type: string;
  label?: string;
  meta: object | undefined;
}

export interface SchemaObjectDescription extends SchemaDescription {
  fields: Record<string, SchemaFieldDescription>;
}

export interface SchemaRefDescription {
  type: 'ref';
  key: string;
}
