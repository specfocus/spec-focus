import { Stream } from 'stream';
import { isNull } from '../maybe';
import { FUNCTION_TYPE } from '../functions';
import { isObject } from '../objects';

const isStream = (val: unknown): val is Stream =>
  !isNull(val) && isObject(val) && typeof val.pipe === FUNCTION_TYPE;

export default isStream;