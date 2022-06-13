
export function getAsyncIterator<T>(
  asyncIterable: AsyncIterable<T>
): AsyncIterator<T> {
  const method = asyncIterable[Symbol.asyncIterator];
  return method.call(asyncIterable);
}

export function isAsyncIterable<T>(input: unknown): input is AsyncIterable<T> {
  return (
    typeof input === "object" &&
    input !== null &&
    // The AsyncGenerator check is for Safari on iOS which currently does not have
    // Symbol.asyncIterator implemented
    // That means every custom AsyncIterable must be built using a AsyncGeneratorFunction (async function * () {})
    ((input as any)[Symbol.toStringTag] === "AsyncGenerator" ||
      (Symbol.asyncIterator && Symbol.asyncIterator in input))
  );
}

type Deferred<T> = {
  resolve: (value: T) => void;
  reject: (value: unknown) => void;
  promise: Promise<T>;
};

function createDeferred<T>(): Deferred<T> {
  const d = {} as Deferred<T>;
  d.promise = new Promise<T>((resolve, reject) => {
    d.resolve = resolve;
    d.reject = reject;
  });
  return d;
}

export type PushPullAsyncIterableIterator<T> = {
  /* Push a new value that will be published on the AsyncIterableIterator. */
  pushValue: (value: T) => void;
  /* AsyncIterableIterator that publishes the values pushed on the stack with pushValue. */
  asyncIterableIterator: AsyncIterableIterator<T>;
};

const SYMBOL_FINISHED = Symbol();
const SYMBOL_NEW_VALUE = Symbol();

/**
 * makePushPullAsyncIterableIterator
 *
 * The iterable will publish values until return or throw is called.
 * Afterwards it is in the completed state and cannot be used for publishing any further values.
 * It will handle back-pressure and keep pushed values until they are consumed by a source.
 */
export function makePushPullAsyncIterableIterator<
  T
>(): PushPullAsyncIterableIterator<T> {
  let isRunning = true;
  const values: T[] = [];

  let newValueD = createDeferred<typeof SYMBOL_NEW_VALUE>();
  const finishedD = createDeferred<typeof SYMBOL_FINISHED | any>();

  const asyncIterableIterator =
    (async function* PushPullAsyncIterableIterator(): AsyncIterableIterator<T> {
      while (true) {
        if (values.length > 0) {
          yield values.shift()!;
        } else {
          const result = await Promise.race([
            newValueD.promise,
            finishedD.promise,
          ]);

          if (result === SYMBOL_FINISHED) {
            break;
          }
          if (result !== SYMBOL_NEW_VALUE) {
            throw result;
          }
        }
      }
    })();

  function pushValue(value: T) {
    if (isRunning === false) {
      // TODO: Should this throw?
      return;
    }

    values.push(value);
    newValueD.resolve(SYMBOL_NEW_VALUE);
    newValueD = createDeferred();
  }

  // We monkey patch the original generator for clean-up
  const originalReturn = asyncIterableIterator.return!.bind(
    asyncIterableIterator
  );

  asyncIterableIterator.return = (
    ...args
  ): Promise<IteratorResult<T, void>> => {
    isRunning = false;
    finishedD.resolve(SYMBOL_FINISHED);
    return originalReturn(...args);
  };

  const originalThrow = asyncIterableIterator.throw!.bind(
    asyncIterableIterator
  );
  asyncIterableIterator.throw = (err): Promise<IteratorResult<T, void>> => {
    isRunning = false;
    finishedD.resolve(err);
    return originalThrow(err);
  };

  return {
    pushValue,
    asyncIterableIterator,
  };
}

export interface Sink<TValue = unknown, TError = unknown> {
  next: (value: TValue) => void;
  error: (error: TError) => void;
  complete: () => void;
}

export const makeAsyncIterableIteratorFromSink = <
  TValue = unknown,
  TError = unknown
>(
  make: (sink: Sink<TValue, TError>) => () => void
): AsyncIterableIterator<TValue> => {
  const { pushValue, asyncIterableIterator } =
    makePushPullAsyncIterableIterator<TValue>();
  const dispose = make({
    next: (value: TValue) => {
      console.log("5", value);
      pushValue(value);
    },
    complete: () => {
      asyncIterableIterator.return!();
    },
    error: (err: TError) => {
      asyncIterableIterator.throw!(err);
    },
  });
  const originalReturn = asyncIterableIterator.return!;
  let returnValue: ReturnType<typeof originalReturn> | undefined;
  asyncIterableIterator.return = () => {
    if (returnValue === undefined) {
      dispose();
      returnValue = originalReturn();
    }
    console.log("3");
    return returnValue;
  };
  console.log("4");
  return asyncIterableIterator;
};

export function applyAsyncIterableIteratorToSink<
  TValue = unknown,
  TError = unknown
>(
  asyncIterableIterator: AsyncIterableIterator<TValue>,
  sink: Sink<TValue, TError>
): () => void {
  const run = async () => {
    try {
      for await (const value of asyncIterableIterator) {
        sink.next(value);
      }
      sink.complete();
    } catch (err: any) {
      sink.error(err);
    }
  };
  run();

  return () => {
    asyncIterableIterator.return?.();
  };
}
/*
export const myAsyncIterable = {
  async *[Symbol.asyncIterator]() {
    yield "hello";
    yield "async";
    yield "iteration!";
  },
};

(async () => {
  for await (const x of myAsyncIterable) {
    console.log(x);
    // expected output:
    //    "hello"
    //    "async"
    //    "iteration!"
  }
})();
*/