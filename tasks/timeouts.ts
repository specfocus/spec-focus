export interface TimeoutOptions {
  factor?: number;
  forever?: boolean;
  maxTimeout?: number;
  minTimeout?: number;
  randomize?: boolean;
}

export const createTimeout = function (attempt: number, opts: TimeoutOptions) {
  const random = (opts.randomize)
    ? (Math.random() + 1)
    : 1;

  let timeout = Math.round(random * Math.max(opts.minTimeout, 1) * Math.pow(opts.factor, attempt));
  timeout = Math.min(timeout, opts.maxTimeout);

  return timeout;
};

export const timeouts = function (options: TimeoutOptions) {
  if (options instanceof Array) {
    return [].concat(options);
  }

  const opts = Object.assign(
    {
      retries: 10,
      factor: 2,
      minTimeout: 1 * 1000,
      maxTimeout: Infinity,
      randomize: false
    },
    options
  );

  if (opts.minTimeout > opts.maxTimeout) {
    throw new Error('minTimeout is greater than maxTimeout');
  }

  const timeouts = [];
  for (let i = 0; i < opts.retries; i++) {
    timeouts.push(createTimeout(i, opts));
  }

  if (options && options.forever && !timeouts.length) {
    timeouts.push(createTimeout(1, opts));
  }

  // sort the array numerically ascending
  timeouts.sort(function (a, b) {
    return a - b;
  });

  return timeouts;
};