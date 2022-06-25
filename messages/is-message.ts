import isString from '../strings/isString';
import { Message } from '../validations/errors';

export default (value: unknown): value is Message => isString(value)
