import { inspect } from 'util';

const getTruthy = (promise: Promise<boolean>): boolean | undefined => {
  if (inspect(promise).includes('{ true }')) {
    return true;
  }
  if (inspect(promise).includes('{ false }')) {
    return false;
  }
};

export default getTruthy;
