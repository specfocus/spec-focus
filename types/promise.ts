import { inspect } from 'util';

const PENDING = 'pending';

export const isPromise = <T>(val: unknown): val is Promise<T> =>
  Promise.resolve(val) == val;

export const isPending = <T>(promise: Promise<T>): boolean =>
  inspect(promise).includes(PENDING);

export const getTruthy = (promise: Promise<boolean>): boolean | undefined => {
  if (inspect(promise).includes('{ true }')) {
    return true;
  }
  if (inspect(promise).includes('{ false }')) {
    return false;
  }
};

export const getResult = <T>(promise: Promise<T>): T | undefined => {
  if (isPending(promise)) {
    console.log('pending');
    return;
  }
  console.log('not pending', inspect(promise));

  let result: T | undefined;

  promise.then(r => { result = r; });

  return result;
};

export const promiseWithTimeout = <T>(promise: Promise<T>): [Promise<T | void>, NodeJS.Timeout] => {
  let timeoutId!: NodeJS.Timeout;
  const timeoutPromise = new Promise<void>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error('Request timed out'));
    }, 4000);
  });
  return [
    Promise.race([promise, timeoutPromise]),
    timeoutId
  ];
};