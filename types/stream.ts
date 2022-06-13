import { Stream } from 'stream';
import { FUNCTION } from './function';
import { isNull } from './maybe';
import { isObject } from './object';

export const isStream = (val: any): val is Stream =>
  !isNull(val) && isObject(val) && typeof val.pipe === FUNCTION;
