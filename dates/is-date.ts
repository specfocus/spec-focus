const isDate = (val: unknown): val is Date =>
  val instanceof Object && val.constructor === Date ||
  val instanceof Date;

export default isDate;