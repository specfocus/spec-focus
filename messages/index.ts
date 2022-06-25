export { default as isMessage } from './is-message';

export interface MessageParams {
  path: string;
  value: any;
  originalValue: any;
  label: string;
  type: string;
}

export type Message<Extra extends Record<string, unknown> = any> =
  | string
  | ((params: Extra & MessageParams) => unknown)
  | Record<PropertyKey, unknown>;

export type ExtraParams = Record<string, unknown>;

export type AnyMessageParams = MessageParams & ExtraParams;

