type BooleanLike = boolean;

const DEVELOMENT = process.env.NODE_ENV === 'development';
const NEWLINE = '\n';

const assert = (test: BooleanLike, message: string, callOffset = 1): void => {
  if (test) {
    return;
  }
  const err = new Error(message);
  const trace = err.stack!.split(NEWLINE); // create an array with all lines
  trace.splice(1, callOffset);          // remove the second line (first line after "ERROR")
  err.stack = trace.join(NEWLINE);      // join array back to a string

  if (DEVELOMENT) {
    console.log(`ASSERT ERROR: ${message}\n${err.stack}`);
    return;
  }

  throw err;
};

export const assertNumber = (test: unknown, message: string, callOffset = 1): test is string => {
  const valid = typeof test === 'number';
  assert(valid, message, callOffset + 1);
  return valid;
}

export const assertString = (test: unknown, message: string, callOffset = 1): test is string => {
  const valid = typeof test === 'string';
  assert(valid, message, callOffset + 1);
  return valid;
}

export default assert;
