import { inspect } from 'util';
import isPending from './is-pending';

const getResult = <T>(promise: Promise<T>): T | undefined => {
  if (isPending(promise)) {
    console.log('pending');
    return;
  }
  console.log('not pending', inspect(promise));

  let result: T | undefined;

  promise.then(r => { result = r; });

  return result;
};

export default getResult;