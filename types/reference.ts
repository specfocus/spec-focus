import { SimpleObject } from './object';

export type Reference<T extends {}, K extends keyof T> = Pick<T, K> & SimpleObject;