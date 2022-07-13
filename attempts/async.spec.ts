import attempt, { BailError } from './async';
const fetch = require('node-fetch');
const sleep = require('then-sleep');

describe('async retry', () => {
  it('should return value', async () => {
    const val = await attempt(async (bail, num) => {
      if (num < 2) {
        throw new Error('woot');
      }

      await sleep(50);
      return `woot ${num}`;
    });

    expect(val).toBe('woot 2');
  });

  it('should return value no await', async () => {
    const val = await attempt(async (bail, num) => num);
    expect(val).toBe(1);
  });

  it('should chained promise', async () => {
    const res = await attempt(async (bail, num) => {
      if (num < 2) {
        throw new Error('retry');
      }

      return fetch('https://www.wikipedia.org');
    });

    expect(res.status).toBe(200);
  });

  it('should bail', async () => {
    try {
      await attempt(
        async (bail, num) => {
          if (num === 2) {
            bail(new Error('Wont retry'));
          }

          throw new Error(`Test ${num}`);
        },
        { retries: 3 }
      );
    } catch (err) {
      expect(err.message).toBe('Wont retry');
    }
  });

  it('should bail + return', async () => {
    let error;

    try {
      await Promise.resolve(
        attempt(async bail => {
          await sleep(200);
          await sleep(200);
          bail(new Error('woot'));
        })
      );
    } catch (err) {
      error = err;
    }

    expect(error.message).toBe('woot');
  });

  it('should bail error', async () => {
    let retries = 0;

    try {
      await attempt(
        async () => {
          retries += 1;
          await sleep(100);
          const err = new BailError('Wont retry');
          throw err;
        },
        { retries: 3 }
      );
    } catch (err) {
      expect(err.message).toBe('Wont retry');
    }

    expect(retries).toBe(1);
  });

  it('should with non-async functions', async () => {
    try {
      await attempt(
        (bail, num) => {
          throw new Error(`Test ${num}`);
        },
        { retries: 2 }
      );
    } catch (err) {
      expect(err.message).toBe('Test 3');
    }
  });

  it('should return non-async', async () => {
    const val = await attempt(() => 5);
    expect(val).toBe(5);
  });

  it('should with number of retries', async () => {
    let retries = 0;

    try {
      await attempt(() => fetch('https://www.fakewikipedia.org'), {
        retries: 2,
        onRetry: (err, i) => {
          if (err) {
            // eslint-disable-next-line no-console
            console.log('Retry error : ', err);
          }

          retries = i;
        }
      });
    } catch (err) {
      expect(retries).deepEqual(2);
    }
  });
});