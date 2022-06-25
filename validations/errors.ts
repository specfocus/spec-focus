import { MultipleFieldErrors } from '../fields/errors';
import { LiteralUnion } from '../literals';
import { RegisterOptions } from './validator';

export type Message = string;

export type CriteriaMode = 'firstError' | 'all';

export type ErrorOption = {
  message?: Message;
  type?: LiteralUnion<keyof RegisterOptions, string>;
  types?: MultipleFieldErrors;
};