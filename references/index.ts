export { create as default } from './reference-schema';
export type Reference<T extends {}, K extends keyof T> = Pick<T, K>;