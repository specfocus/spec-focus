import areEqual from './are-equal';
import isArray from './is-array';

const startsWith = (left: unknown, right: unknown): boolean => {
  if (!isArray(left) || !isArray(right)) {
    return false;
  }

  // compare lengths - can save a lot of time
  const l = right.length;
  if (left.length < l) {
    return false;
  }

  for (let i = 0; i < l; i++) {
    // Check if we have nested arrays
    if (isArray(left[i]) && isArray(right[i])) {
      // recurse into the nested arrays
      if (!areEqual(left[i], right[i])) {
          return false;
      }
    }
    else if (left[i] !== right[i]) {
      // Warning - two different object instances will never be equal: {x:20} != {x:20}
      return false;
    }
  }
  return true;
};

export default startsWith;