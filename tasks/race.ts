import { MaybePromise } from '../maybe';
import { timeouts, type TimeoutOptions } from './timeouts';
import type { Task, TaskContext } from './types';

export interface RaceAttempt<Result> {
  done: boolean;
  end?: number;
  error?: Error;
  result?: Result;
  start: number;
  timeout?: NodeJS.Timeout;
}

export interface RaceTrial<Result> {
  attempts: RaceAttempt<Result>[];
}

const mainError = <Result>(trial: RaceTrial<Result>): Error | null => {
  if (trial.attempts.length === 0 || typeof trial.attempts[0].error === 'undefined') {
    return null;
  }

  const counts = {};
  let mainError: Error | null = null;
  let mainErrorCount = 0;

  for (let i = 0; i < trial.attempts.length; i++) {
    const { error } = trial.attempts[i];
    const message = error.message;
    const count = (counts[message] || 0) + 1;

    counts[message] = count;

    if (count >= mainErrorCount) {
      mainError = error;
      mainErrorCount = count;
    }
  }

  return mainError;
}

export interface RaceController<
  Result,
  Params extends {},
  Context extends TaskContext
> {
  try: (
    tast: Task<Result, Params, Context>,
    params: Params,
    context: Context
  ) => Promise<RaceAttempt<Result>>;
}

export const race = <Result, Params, Context extends TaskContext>(
  task: Task<Result, Params, Context>,
  trial: RaceTrial<Result>,
  controller: RaceController<Result, Params, Context>
) => async (
  params: Params,
  context: Context
): Promise<Result> => {
    let attempt: RaceAttempt<Result>;
    do {
      attempt = await controller.try(task, params, context);
      trial.attempts.unshift(attempt);
    } while (!attempt.done);

    if (attempt.error) {
      const error = mainError(trial);
      throw error;
    }

    return attempt.result;
  };

export interface RaceOptions extends TimeoutOptions {
  // retries?: number;
  // onRetry?: (err: Error, count: number) => void;
  maxRetryTime?: number;
  unref?: any;
}

export class RaceTimeoutController<
  Result,
  Params,
  Context extends TaskContext
> implements RaceController<Result, Params, Context> {
  static readonly create = (
    options?: RaceOptions
  ) => new RaceTimeoutController(timeouts(options), {
    forever: options?.forever,
    maxRetryTime: options?.maxRetryTime
  });

  _originalTimeouts = [0];
  _timeouts = [0];
  _options: RaceOptions = {};
  _maxRetryTime = Infinity;
  _cachedTimeouts = [0];

  constructor(timeouts: number[], options: RaceOptions) {
    this._originalTimeouts = JSON.parse(JSON.stringify(timeouts));
    this._timeouts = timeouts;
    this._maxRetryTime = this._options.maxRetryTime || Infinity;

    if (this._options.forever) {
      this._cachedTimeouts = this._timeouts.slice(0);
    }
  }

  try = async (
    task: Task<Result, Params, Context>,
    params: Params,
    context: Context
  ): Promise<RaceAttempt<Result>> => {
    const attempt: RaceAttempt<Result> = {
      done: false,
      start: new Date().getTime(),/*
      timeout: setTimeout(
        () => {
          // context.abort();
        },
        self._operationTimeout
      )*/
    };

    try {
      await Promise.resolve(
        task(params, context)
      ).then(
        result => {
          attempt.result = result;
        }
      ).catch(
        error => {
          attempt.error = error;
        }
      );
      attempt.done = true;
    } catch (error) {
      attempt.error = error;
    }

    attempt.end = new Date().getTime();

    return attempt;
  };
}