import compact from '../arrays/compact';
import isNullOrUndefined from '../maybe/isNullOrUndefined';
import isObject from '../objects/is-object-type';
import isUndefined from '../maybe/isUndefined';

export default <T>(obj: T, path: string, defaultValue?: unknown): any => {
  if (!path || !isObject(obj)) {
    return defaultValue;
  }

  const result = compact(path.split(/[,[\].]+?/)).reduce(
    (result, key) =>
      isNullOrUndefined(result) ? result : result[key as keyof {}],
    obj,
  );

  return isUndefined(result) || result === obj
    ? isUndefined(obj[path as keyof T])
      ? defaultValue
      : obj[path as keyof T]
    : result;
};
