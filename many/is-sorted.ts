const isSorted = (arr: number[]): false | 1 | -1 => {
  let direction = -(arr[0] - arr[1]);
  for (const [i, val] of arr.entries()) {
    direction = !direction ? -(arr[i - 1] - arr[i]) : direction;
    if (i === arr.length - 1) {
      return !direction ? false : (direction / Math.abs(direction)) as 1 | -1;
    } else if ((val - arr[i + 1]) * direction > 0) {
      return false;
    }
  }
  throw new Error('never');
};

export default isSorted;