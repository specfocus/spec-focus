import { EmptyObject } from './is-empty';
import isObject from './is-object-type';

export default (value: unknown): value is EmptyObject =>
  isObject(value) && !Object.keys(value).length;
