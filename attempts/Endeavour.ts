export interface RetryOptions {
  forever?: boolean;
  maxRetryTime?: number;
  unref?: any;
}

export interface EndeavourOptions extends RetryOptions {
  factor?: number;
  maxTimeout?: number;
  minTimeout?: number;
  randomize?: boolean;
  // retries?: number;
  // onRetry?: (err: Error, count: number) => void;
}

export class Endeavour {
  static readonly create = (options?: EndeavourOptions) => new Endeavour(timeouts(options), {
    forever: options?.forever,
    maxRetryTime: options?.maxRetryTime
  });

  _originalTimeouts = [0];
  _timeouts = [0];
  _options: RetryOptions = {};
  _maxRetryTime = Infinity;
  _fn = null;
  _errors: Error[] = [];
  _attempts = 1;
  _operationTimeout = null;
  _operationTimeoutCb = null;
  _timeout = null;
  _operationStart = null;
  _timer = null;
  _cachedTimeouts = [0];

  constructor(timeouts: number[], options: RetryOptions) {
    this._originalTimeouts = JSON.parse(JSON.stringify(timeouts));
    this._timeouts = timeouts;
    this._options = options || {};
    this._maxRetryTime = this._options.maxRetryTime || Infinity;

    if (this._options.forever) {
      this._cachedTimeouts = this._timeouts.slice(0);
    }
  }

  get attempts(): number {
    return this._attempts;
  };

  get errors(): Error[] {
    return this._errors;
  };

  get mainError(): Error | null {
    if (this._errors.length === 0) {
      return null;
    }

    const counts = {};
    let mainError: Error | null = null;
    let mainErrorCount = 0;

    for (let i = 0; i < this._errors.length; i++) {
      const error = this._errors[i];
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

  attempt = (fn: Function, timeoutOps: any = undefined) => {
    this._fn = fn;

    if (timeoutOps) {
      if (timeoutOps.timeout) {
        this._operationTimeout = timeoutOps.timeout;
      }
      if (timeoutOps.cb) {
        this._operationTimeoutCb = timeoutOps.cb;
      }
    }

    const self = this;
    if (this._operationTimeoutCb) {
      this._timeout = setTimeout(function () {
        self._operationTimeoutCb();
      }, self._operationTimeout);
    }

    this._operationStart = new Date().getTime();

    this._fn(this._attempts);
  };

  reset = () => {
    this._attempts = 1;
    this._timeouts = this._originalTimeouts.slice(0);
  };

  retry = (err: Error): boolean => {
    if (this._timeout) {
      clearTimeout(this._timeout);
    }

    if (!err) {
      return false;
    }
    const currentTime = new Date().getTime();
    if (err && currentTime - this._operationStart >= this._maxRetryTime) {
      this._errors.push(err);
      this._errors.unshift(new Error('RetryOperation timeout occurred'));
      return false;
    }

    this._errors.push(err);

    let timeout = this._timeouts.shift();
    if (timeout === undefined) {
      if (this._cachedTimeouts) {
        // retry forever, only keep last error
        this._errors.splice(0, this._errors.length - 1);
        timeout = this._cachedTimeouts.slice(-1).shift();
      } else {
        return false;
      }
    }

    const self = this;
    this._timer = setTimeout(function () {
      self._attempts++;

      if (self._operationTimeoutCb) {
        self._timeout = setTimeout(function () {
          self._operationTimeoutCb(self._attempts);
        }, self._operationTimeout);

        if (self._options.unref) {
          self._timeout.unref();
        }
      }

      self._fn(self._attempts);
    }, timeout);

    if (this._options.unref) {
      this._timer.unref();
    }

    return true;
  };

  stop = () => {
    if (this._timeout) {
      clearTimeout(this._timeout);
    }
    if (this._timer) {
      clearTimeout(this._timer);
    }

    this._timeouts = [];
    this._cachedTimeouts = null;
  };
}

export const wrap = (obj: object, options: RetryOptions, methods: string[]) => {
  if (options instanceof Array) {
    methods = options;
    options = null;
  }

  if (!methods) {
    methods = [];
    for (let key in obj) {
      if (typeof obj[key] === 'function') {
        methods.push(key);
      }
    }
  }

  for (let i = 0; i < methods.length; i++) {
    let method = methods[i];
    let original = obj[method];

    obj[method] = function retryWrapper(original) {
      const endeavour = Endeavour.create(options);
      let args = Array.prototype.slice.call(arguments, 1);
      let callback = args.pop();

      args.push(function (err) {
        if (endeavour.retry(err)) {
          return;
        }
        if (err) {
          arguments[0] = endeavour.mainError;
        }
        callback.apply(this, arguments);
      });

      endeavour.attempt(
        () => {
          original.apply(obj, args);
        }
      );
    }.bind(obj, original);
    obj[method].options = options;
  }
};