import { isObjectType } from '../objects';
import { Primitive } from '../primitives';
import isNullOrUndefined from '../maybe/isNullOrUndefined';

export default (value: unknown): value is Primitive =>
  isNullOrUndefined(value) || !isObjectType(value);
