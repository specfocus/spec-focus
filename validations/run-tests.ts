import { ValidationError } from './error';
import type { TestOptions } from './create-validation';

export type RunTest = (opts: TestOptions) => Iterable<Error>;

export type TestRunOptions = {
  tests: RunTest[];
  args?: TestOptions;
  path?: string;
  value: any;
};

export default function* runTests(options: TestRunOptions): Generator<Error> {
  let {  tests, args, value } = options;

  let count = tests.length;

  if (!count) {
    return;
  }

  for (let i = 0; i < tests.length; i++) {
    const test = tests[i];

    for (const err of test(args!)) {
      if (err) {
        // always return early for non validation errors
        if (!ValidationError.isError(err)) {
          return err;
        }

        err.value = value;
        
        yield err;
      }
    }
  }
}
