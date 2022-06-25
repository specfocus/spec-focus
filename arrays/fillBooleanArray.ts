import convertToArrayPayload from './convertToArrayPayload';
import isObject from '../objects/is-object-type';

export default <T>(value: T) =>
  (convertToArrayPayload(value) as T[]).map((data) => {
    if (isObject(data)) {
      const object: Record<string, boolean> = {};

      for (const key in data) {
        object[key] = true;
      }

      return object;
    }

    return true;
  });
