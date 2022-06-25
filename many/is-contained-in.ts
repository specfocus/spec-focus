/**
 * Area all elements in a found in b?
 * @param a sub-set
 * @param b super-set
 * @returns
 */
const isContainedIn = (a: unknown[], b: unknown[]): boolean => {
  for (const v of new Set(a)) {
    if (
      !b.some((e) => e === v) ||
      a.filter((e) => e === v).length > b.filter((e) => e === v).length
    ) {
      return false;
    }
  }
  return true;
};

export default isContainedIn;