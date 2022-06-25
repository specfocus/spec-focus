import isArray from './is-array';
import startsWith from './starts-with';

const areEqual = (left: unknown, right: unknown): boolean => {
  if (!isArray(left) || !isArray(right)) {
    return false;
  }

  // compare lengths - can save a lot of time
  if (left.length !== right.length) {
      return false;
  }

  return startsWith(left, right);
};

export default areEqual;