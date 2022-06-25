const VARIABLE = /{([^{}]*)}/g;

export type Lookup = (key: string) => string | undefined;
export type SupplantParams = Record<string, bigint | boolean | number | string>;
export const lookup = (params: SupplantParams): Lookup =>
  (key: string): string => {
    const { [key]: val } = params;
    if (typeof val !== undefined) {
      return String(val);
    }
  };

/**
 * http://crockford.com/javascript/
 * @param template
 * @param lookup
 * @example supplant("I'm {age} years old!", { age: 29 })
 * @example supplant("The {a} says {n}, {n}, {n}!", { a: 'cow', n: 'moo' })
 * @returns
 */
const supplant = (template: string, lookup: Lookup) =>
  template.replace(
    VARIABLE,
    (substring: string, key: any): string => lookup(key) || substring
  );

export default supplant;
