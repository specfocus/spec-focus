import { Shape } from '../shapes';
import { DICTIONARY, RECORD } from './record';
import { Reference } from '../references';
import { STRING_TYPE } from '../strings/string-field';
import { FieldMap, TypeOf } from './field';

export type ModelReference = Reference<Model, 'name' | 'area'>;

export interface Model<T extends {} = Shape> {
  area: string;
  name: string;
  hint: string;
  fields: FieldMap<T>;
}

export type NamedArgsOf<T> = {
  [P in keyof T]: TypeOf<T[P]>;
};

export const model: Model<Model> = {
  area: 'data',
  name: 'Model',
  hint: 'Object type descriptor',
  fields: {
    area: { type: STRING_TYPE },
    name: { type: STRING_TYPE },
    hint: { type: STRING_TYPE },
    fields: { type: [RECORD, DICTIONARY] }
  }
};