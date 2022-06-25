import { isObject } from '.';

describe('objects', () => {
  describe('isObject', () => {
    it('should succeed if Record', () => {
      expect(isObject({})).toBe(true);
    });
    it('should succeed if new Object', () => {
      expect(isObject(new Object)).toBe(true);
    });
    it('should fail if new Date', () => {
      expect(isObject(new Date)).toBe(false);
    });
    it('should fail if undefined', () => {
      expect(isObject(undefined)).toBe(false);
    });
    it('should fail if null', () => {
      expect(isObject(null)).toBe(false);
    });
    it('should fail if Array', () => {
      expect(isObject([])).toBe(false);
    });
    it('should fail if number', () => {
      expect(isObject(1)).toBe(false);
      expect(isObject(new Number(1))).toBe(false);
    });
    it('should fail if string', () => {
      expect(isObject('')).toBe(false);
    });
    it('should fail if boolean', () => {
      expect(isObject(true)).toBe(false);
      expect(isObject(false)).toBe(false);
      expect(isObject(new Boolean(true))).toBe(false);
      expect(isObject(new Boolean(false))).toBe(false);
    });
    it('should fail if function', () => {
      expect(isObject(() => {})).toBe(false);
    });
  });
});