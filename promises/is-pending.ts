import { inspect } from 'util';

const PENDING = 'pending';

const isPending = <T>(promise: Promise<T>): boolean =>
  inspect(promise).includes(PENDING);

export default isPending;