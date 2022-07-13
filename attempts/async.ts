import { type MaybePromise } from '../maybe';
import { Endeavour, type EndeavourOptions } from './Endeavour';

export class BailError extends Error {
  constructor(message: string) {
    super(message)
  }
  get bail(): boolean {
    return true;
  }
}

type Resolver<T> = (reject: Reject, attempt: number) => MaybePromise<T>;
type Resolve<T> = (value: T | PromiseLike<T>) => void;
type Reject = (err?: Error) => void;

const async = <T>(fn: Resolver<T>, opts?: EndeavourOptions): Promise<T> => {
  const run = (resolve: Resolve<T>, reject: Reject): void => {
    const options = opts || {};
    let endeavour: Endeavour;

    // Default `randomize` to true
    if (!('randomize' in options)) {
      options.randomize = true;
    }

    endeavour = Endeavour.create(options);

    // We allow the user to abort retrying
    // this makes sense in the cases where
    // knowledge is obtained that retrying
    // would be futile (e.g.: auth errors)

    const bail: Reject = (err) => {
      reject(err || new Error('Aborted'));
    };

    const onError = (err: BailError, num: number) => {
      if (err.bail) {
        bail(err);
        return;
      }

      if (!endeavour.retry(err)) {
        reject(endeavour.mainError);
      } else if (options.onRetry) {
        options.onRetry(err, num);
      }
    };

    const runAttempt = (num: number) => {
      let val: MaybePromise<T>;

      try {
        val = fn(bail, num);
      } catch (err) {
        onError(err, num);
        return;
      }

      Promise.resolve(val)
        .then(resolve)
        .catch(
          (err) => {
            onError(err, num);
          }
        );
    };

    endeavour.attempt(runAttempt);
  };

  return new Promise<T>(run);
};

export default async;