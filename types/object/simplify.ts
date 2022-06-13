import { SimpleObject, SimpleType } from './simple';

// TODO: reuse clone with simplify argument
const simplify = (val: unknown): SimpleType | undefined => {
  switch (typeof val) {
    case 'bigint':
    case 'boolean':
    case 'number':
    case 'string':
      return val;
    case 'undefined':
    case 'function':
    case 'symbol':
      return;
    case 'object':
      if (val === null) return null;
      if (val instanceof Boolean) return val.valueOf();
      if (val instanceof Date) return val.valueOf();
      if (val instanceof Number) return val.valueOf();
      if (val instanceof String) return val.valueOf();
      if (Array.isArray(val)) return val.map(simplify);
      return simplifyObject(val);
  };
};

export const simplifyObject = <T extends {} = SimpleObject>(src: T): SimpleObject =>
  Object.entries(src).reduce(
    (acc, [key, val]) => {
      switch (val) {
        case NaN:
          return true;
        case null:
          return true;
      }
      switch (typeof val) {
        case 'bigint':
        case 'boolean':
        case 'number':
        case 'string':
          return Object.assign(acc, { [key]: val });
        case 'undefined':
        case 'function':
        case 'symbol':
          return acc;
        case 'object':
          if (val === null) {
            return Object.assign(acc, { [key]: val });
          }
          if (Array.isArray(val)) {
            return Object.assign(acc, { [key]: val.map(simplify) });
          }
          switch (val.constructor) {
            case Boolean:
            case Date:
            case Number:
            case String:
              return Object.assign(acc, { [key]: val.valueOf() });
            default:
              return Object.assign(acc, { [key]: simplify(val) });
          }
        default:
          throw 'not implemented';
      }
    },
    {}
  );

export default simplify;