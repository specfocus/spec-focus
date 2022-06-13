
export const freeze = (val: unknown): unknown => {
  if (typeof val !== 'object') {
    return val;
  }
  if (val === null) {
    return null;
  }

  if (Array.isArray(val)) {
    return Object.freeze(val.map(freeze));
  }

  return deepFreeze(val);
};

export const deepFreeze = <T extends {}>(obj: T): Readonly<T> =>
  Object.freeze(
    Object.entries(obj).reduce(
      (acc, [key, val]) => Object.assign(acc, { [key]: freeze(val) }),
      {} as T
    )
  );