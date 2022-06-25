const valueOf = (val: unknown): unknown => {
  if (val instanceof Boolean) {
    return val.valueOf();
  }
  if (val instanceof Date) {
    return val.valueOf();
  }
  if (val instanceof Number) {
    return val.valueOf();
  }
  if (val instanceof String) {
    return val.valueOf();
  }
  return val;
};

export default valueOf;