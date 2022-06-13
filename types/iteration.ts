import { getAsyncIterator, isAsyncIterable } from './iterable';

export const join = async <T>(promises: Promise<T>[]): Promise<T[]> => {
  const result: T[] = [];
  for await (const val of promises) {
    result.push(val);
  }
  return result;
};
export const unique = <T>(val: T, index: number, arr: T[]) => arr.indexOf(val) === index;
export const distinct = <T>(arr: T[]): T[] => arr.filter(unique);
export const first = async <T>(
  iterable: Promise<AsyncIterable<T> | AsyncIterator<T>>
) => new AsyncIteration<T>(await iterable).first();
export const last = async <T>(
  iterable: Promise<AsyncIterable<T> | AsyncIterator<T>>
) => new AsyncIteration<T>(await iterable).last();
export const skip = async <T>(
  iterable: Promise<AsyncIterable<T> | AsyncIterator<T>>,
  count: number
) => new AsyncIteration<T>(await iterable).skip(count);

export class AsyncIteration<T> {
  constructor(asyncIterable: AsyncIterable<T> | AsyncIterator<T>) {
    this.asyncIterator = isAsyncIterable(asyncIterable)
      ? getAsyncIterator(asyncIterable)
      : asyncIterable;
  }

  declare asyncIterator: AsyncIterator<T>;

  async first(): Promise<T | undefined> {
    const { done, value } = await this.asyncIterator.next();

    if (done) {
      return;
    }

    return value;
  }

  async last(): Promise<T | undefined> {
    let result: T | undefined;
    for (; ;) {
      const { done, value } = await this.asyncIterator.next();

      if (done) {
        break;
      }

      result = value;
    }
    return result;
  }

  async next(): Promise<T | undefined> {
    const { done, value } = await this.asyncIterator.next();

    if (done) {
      return;
    }

    return value;
  }

  async skip(count: number): Promise<AsyncIteration<T>> {
    for (let i = 0; i < count; i++) {
      const { done, value } = await this.asyncIterator.next();

      if (done) {
        break;
      }
    }
    return this;
  }
}
