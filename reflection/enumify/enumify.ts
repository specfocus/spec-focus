// https://2ality.com/2020/01/enum-pattern.html

export class Enumify {
  // #################### Static

  static enumKeys: string[];
  static enumValues: Enumify[];
  static closeEnum() {
    const enumKeys: string[] = [];
    const enumValues: Enumify[] = [];
    // Traverse the enum entries
    for (const [key, value] of Object.entries(this)) {
      enumKeys.push(key);

      value.enumKey = key;
      value.enumOrdinal = enumValues.length;
      enumValues.push(value);
    }
    // Important: only add more static properties *after* processing the enum entries
    this.enumKeys = enumKeys;
    this.enumValues = enumValues;
    // TODO: prevent instantiation now. Freeze `this`?
  }

  /** Use case: parsing enum values */
  static enumValueOf(str: string): undefined | Enumify {
    const index = this.enumKeys.indexOf(str);
    if (index >= 0) {
      return this.enumValues[index];
    }
    return undefined;
  }
  static [Symbol.iterator]() {
    return this.enumValues[Symbol.iterator]();
  }

  // #################### Instance

  enumKey!: string;
  enumOrdinal!: number;

  toString() {
    return this.constructor.name + '.' + this.enumKey;
  }
}
