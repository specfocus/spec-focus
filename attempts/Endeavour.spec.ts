import _fake from 'fake';
import { Endeavour, wrap } from './Endeavour';

const fake = _fake.create();

describe('forever', () => {
  it('should not throw', () => {
    const testForeverUsesFirstTimeout = jest.fn(
      () => {
        const endeavour = Endeavour.create({
          retries: 0,
          minTimeout: 100,
          maxTimeout: 100,
          forever: true
        });

        endeavour.attempt(function (numAttempt) {
          console.log('>numAttempt', numAttempt);
          const err = new Error("foo");
          if (numAttempt == 10) {
            endeavour.stop();
          }

          if (endeavour.retry(err)) {
            return;
          }
        });
      });
    expect(testForeverUsesFirstTimeout).not.toThrow();
  });
});
/*
describe('test retry', () => {

  (function testReset() {
    var error = new Error('some error');
    var operation = Endeavour.create([1, 2, 3]);
    var attempts = 0;

    var finalCallback = fake.callback('finalCallback');
    fake.expectAnytime(finalCallback);

    var expectedFinishes = 1;
    var finishes = 0;

    var fn = function () {
      operation.attempt(function (currentAttempt) {
        attempts++;
        expect.toEqual(currentAttempt, attempts);
        if (operation.retry(error)) {
          return;
        }

        finishes++;
        expect.toEqual(expectedFinishes, finishes);
        expect.toBe(attempts, 4);
        expect.toBe(operation.attempts, attempts);
        expect.toBe(operation.mainError, error);

        if (finishes < 2) {
          attempts = 0;
          expectedFinishes++;
          operation.reset();
          fn();
        } else {
          finalCallback();
        }
      });
    };

    fn();
  })();

  (function testErrors() {
    var operation = Endeavour.create();

    var error = new Error('some error');
    var error2 = new Error('some other error');
    operation._errors.push(error);
    operation._errors.push(error2);

    expect.deepEqual(operation.errors(), [error, error2]);
  })();

  (function testMainErrorReturnsMostFrequentError() {
    var operation = Endeavour.create();
    var error = new Error('some error');
    var error2 = new Error('some other error');

    operation._errors.push(error);
    operation._errors.push(error2);
    operation._errors.push(error);

    expect.toBe(operation.mainError, error);
  })();

  (function testMainErrorReturnsLastErrorOnEqualCount() {
    var operation = Endeavour.create();
    var error = new Error('some error');
    var error2 = new Error('some other error');

    operation._errors.push(error);
    operation._errors.push(error2);

    expect.toBe(operation.mainError, error2);
  })();

  (function testAttempt() {
    var operation = Endeavour.create();
    var fn = new Function();

    var timeoutOpts = {
      timeout: 1,
      cb: function () { }
    };
    operation.attempt(fn, timeoutOpts);

    expect.toBe(fn, operation._fn);
    expect.toBe(timeoutOpts.timeout, operation._operationTimeout);
    expect.toBe(timeoutOpts.cb, operation._operationTimeoutCb);
  })();

  (function testRetry() {
    var error = new Error('some error');
    var operation = Endeavour.create([1, 2, 3]);
    var attempts = 0;

    var finalCallback = fake.callback('finalCallback');
    fake.expectAnytime(finalCallback);

    var fn = function () {
      operation.attempt(function (currentAttempt) {
        attempts++;
        expect.toEqual(currentAttempt, attempts);
        if (operation.retry(error)) {
          return;
        }

        expect.toBe(attempts, 4);
        expect.toBe(operation.attempts, attempts);
        expect.toBe(operation.mainError, error);
        finalCallback();
      });
    };

    fn();
  })();

  (function testRetryForever() {
    var error = new Error('some error');
    var operation = Endeavour.create({ retries: 3, forever: true });
    var attempts = 0;

    var finalCallback = fake.callback('finalCallback');
    fake.expectAnytime(finalCallback);

    var fn = function () {
      operation.attempt(function (currentAttempt) {
        attempts++;
        expect(currentAttempt).toEqual(attempts);
        if (attempts !== 6 && operation.retry(error)) {
          return;
        }

        expect(attempts).toBe(6);
        expect(operation.attempts).toBe(attempts);
        expect(operation.mainError).toBe(error);
        finalCallback();
      });
    };

    fn();
  })();

  (function testRetryForeverNoRetries() {
    var error = new Error('some error');
    var delay = 50;
    var operation = Endeavour.create({
      retries: null,
      forever: true,
      minTimeout: delay,
      maxTimeout: delay
    });

    var attempts = 0;
    var startTime = new Date().getTime();

    var finalCallback = fake.callback('finalCallback');
    fake.expectAnytime(finalCallback);

    var fn = function () {
      operation.attempt(function (currentAttempt) {
        attempts++;
        expect(currentAttempt).toEqual(attempts);
        if (attempts !== 4 && operation.retry(error)) {
          return;
        }

        var endTime = new Date().getTime();
        var minTime = startTime + (delay * 3);
        var maxTime = minTime + 20; // add a little headroom for code execution time
        expect(endTime).toBeGreaterThanOrEqual(minTime);
        expect(endTime).toBeLessThan(maxTime);
        expect(attempts).toBe(4);
        expect(operation.attempts).toBe(attempts);
        expect(operation.mainError).toBe(error);
        finalCallback();
      });
    };

    fn();
  })();

  (function testStop() {
    var error = new Error('some error');
    var operation = Endeavour.create([1, 2, 3]);
    var attempts = 0;

    var finalCallback = fake.callback('finalCallback');
    fake.expectAnytime(finalCallback);

    var fn = function () {
      operation.attempt(function (currentAttempt) {
        attempts++;
        expect(currentAttempt).toEqual(attempts);

        if (attempts === 2) {
          operation.stop();

          expect(attempts).toBe(2);
          expect(operation.attempts).toBe(attempts);
          expect(operation.mainError).toBe(error);
          finalCallback();
        }

        if (operation.retry(error)) {
          return;
        }
      });
    };

    fn();
  })();

  (function testMaxRetryTime() {
    var error = new Error('some error');
    var maxRetryTime = 30;
    var operation = Endeavour.create({
      minTimeout: 1,
      maxRetryTime: maxRetryTime
    });
    var attempts = 0;

    var finalCallback = fake.callback('finalCallback');
    fake.expectAnytime(finalCallback);

    var longAsyncFunction = function (wait, callback) {
      setTimeout(callback, wait);
    };

    var fn = function () {
      var startTime = new Date().getTime();
      operation.attempt(function (currentAttempt) {
        attempts++;
        expect.toEqual(currentAttempt, attempts);

        if (attempts !== 2) {
          if (operation.retry(error)) {
            return;
          }
        } else {
          var curTime = new Date().getTime();
          longAsyncFunction(maxRetryTime - (curTime - startTime - 1), function () {
            if (operation.retry(error)) {
              expect.fail('timeout should be occurred');
              return;
            }

            expect.toBe(operation.mainError, error);
            finalCallback();
          });
        }
      });
    };

    fn();
  })();

  (function testErrorsPreservedWhenMaxRetryTimeExceeded() {
    var error = new Error('some error');
    var maxRetryTime = 30;
    var operation = Endeavour.create({
      minTimeout: 1,
      maxRetryTime: maxRetryTime
    });

    var finalCallback = fake.callback('finalCallback');
    fake.expectAnytime(finalCallback);

    var longAsyncFunction = function (wait, callback) {
      setTimeout(callback, wait);
    };

    var fn = function () {
      var startTime = new Date().getTime();
      operation.attempt(function () {

        var curTime = new Date().getTime();
        longAsyncFunction(maxRetryTime - (curTime - startTime - 1), function () {
          if (operation.retry(error)) {
            expect.fail('timeout should be occurred');
            return;
          }

          expect.toBe(operation.mainError, error);
          finalCallback();
        });
      });
    };

    fn();
  })();
});

describe('test wrap', () => {
  function getLib() {
    return {
      fn1: function () { },
      fn2: function () { },
      fn3: function () { }
    };
  }

  (function wrapAll() {
    var lib = getLib();
    retry.wrap(lib);
    expect.toEqual(lib.fn1.name, 'bound retryWrapper');
    expect.toEqual(lib.fn2.name, 'bound retryWrapper');
    expect.toEqual(lib.fn3.name, 'bound retryWrapper');
  }());

  (function wrapAllPassOptions() {
    var lib = getLib();
    retry.wrap(lib, { retries: 2 });
    expect.toEqual(lib.fn1.name, 'bound retryWrapper');
    expect.toEqual(lib.fn2.name, 'bound retryWrapper');
    expect.toEqual(lib.fn3.name, 'bound retryWrapper');
    expect.toEqual(lib.fn1.options.retries, 2);
    expect.toEqual(lib.fn2.options.retries, 2);
    expect.toEqual(lib.fn3.options.retries, 2);
  }());

  (function wrapDefined() {
    var lib = getLib();
    retry.wrap(lib, ['fn2', 'fn3']);
    expect.notEqual(lib.fn1.name, 'bound retryWrapper');
    expect.toEqual(lib.fn2.name, 'bound retryWrapper');
    expect.toEqual(lib.fn3.name, 'bound retryWrapper');
  }());

  (function wrapDefinedAndPassOptions() {
    var lib = getLib();
    retry.wrap(lib, { retries: 2 }, ['fn2', 'fn3']);
    expect.notEqual(lib.fn1.name, 'bound retryWrapper');
    expect.toEqual(lib.fn2.name, 'bound retryWrapper');
    expect.toEqual(lib.fn3.name, 'bound retryWrapper');
    expect.toEqual(lib.fn2.options.retries, 2);
    expect.toEqual(lib.fn3.options.retries, 2);
  }());

  (function runWrappedWithoutError() {
    var callbackCalled;
    var lib = {
      method: function (a, b, callback) {
        expect.toEqual(a, 1);
        expect.toEqual(b, 2);
        expect.toEqual(typeof callback, 'function');
        callback();
      }
    };
    retry.wrap(lib);
    lib.method(1, 2, function () {
      callbackCalled = true;
    });
    expect.ok(callbackCalled);
  }());

  (function runWrappedSeveralWithoutError() {
    var callbacksCalled = 0;
    var lib = {
      fn1: function (a, callback) {
        expect.toEqual(a, 1);
        expect.toEqual(typeof callback, 'function');
        callback();
      },
      fn2: function (a, callback) {
        expect.toEqual(a, 2);
        expect.toEqual(typeof callback, 'function');
        callback();
      }
    };
    retry.wrap(lib, {}, ['fn1', 'fn2']);
    lib.fn1(1, function () {
      callbacksCalled++;
    });
    lib.fn2(2, function () {
      callbacksCalled++;
    });
    expect.toEqual(callbacksCalled, 2);
  }());

  (function runWrappedWithError() {
    var callbackCalled;
    var lib = {
      method: function (callback) {
        callback(new Error('Some error'));
      }
    };
    retry.wrap(lib, { retries: 1 });
    lib.method(function (err) {
      callbackCalled = true;
      expect.ok(err instanceof Error);
    });
    expect.ok(!callbackCalled);
  }());
});

describe('test timeout', () => {
  (function testDefaultValues() {
    var timeouts = retry.timeouts();
  
    expect.toEqual(timeouts.length, 10);
    expect.toEqual(timeouts[0], 1000);
    expect.toEqual(timeouts[1], 2000);
    expect.toEqual(timeouts[2], 4000);
  })();
  
  (function testDefaultValuesWithRandomize() {
    var minTimeout = 5000;
    var timeouts = retry.timeouts({
      minTimeout: minTimeout,
      randomize: true
    });
  
    expect.toEqual(timeouts.length, 10);
    expect.ok(timeouts[0] > minTimeout);
    expect.ok(timeouts[1] > timeouts[0]);
    expect.ok(timeouts[2] > timeouts[1]);
  })();
  
  (function testPassedTimeoutsAreUsed() {
    var timeoutsArray = [1000, 2000, 3000];
    var timeouts = retry.timeouts(timeoutsArray);
    expect.deepEqual(timeouts, timeoutsArray);
    expect.notStrictEqual(timeouts, timeoutsArray);
  })();
  
  (function testTimeoutsAreWithinBoundaries() {
    var minTimeout = 1000;
    var maxTimeout = 10000;
    var timeouts = retry.timeouts({
      minTimeout: minTimeout,
      maxTimeout: maxTimeout
    });
    for (var i = 0; i < timeouts; i++) {
      expect(timeouts[i]).toBeGreaterThanOrEqual(minTimeout);
      expect(timeouts[i]).toBeLessThanOrEqual(maxTimeout);
    }
  })();
  
  (function testTimeoutsAreIncremental() {
    var timeouts = retry.timeouts();
    var lastTimeout = timeouts[0];
    for (var i = 0; i < timeouts; i++) {
      expect.ok(timeouts[i] > lastTimeout);
      lastTimeout = timeouts[i];
    }
  })();
  
  (function testTimeoutsAreIncrementalForFactorsLessThanOne() {
    var timeouts = retry.timeouts({
      retries: 3,
      factor: 0.5
    });
  
    var expected = [250, 500, 1000];
    expect.deepEqual(expected, timeouts);
  })();
  
  (function testRetries() {
    var timeouts = retry.timeouts({retries: 2});
    expect.toBe(timeouts.length, 2);
  })();
});
*/