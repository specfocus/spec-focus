import { isValue } from './value';

describe('values', () => {
  describe('isValue', () => {
    it('should fail if Record', () => {
      expect(isValue({})).toBe(false);
    });
    it('should fail if new Object', () => {
      expect(isValue(new Object)).toBe(false);
    });
    it('should fail if new Date', () => {
      expect(isValue(new Date)).toBe(false);
    });
    it('should fail if Array', () => {
      expect(isValue([])).toBe(false);
    });
    it('should fail if undefined', () => {
      expect(isValue(undefined)).toBe(false);
    });
    it('should fail if null', () => {
      expect(isValue(null)).toBe(false);
    });
    it('should succeed if number', () => {
      expect(isValue(1)).toBe(true);
      expect(isValue(new Number(1))).toBe(true);
    });
    it('should succees if string', () => {
      expect(isValue('')).toBe(true);
      expect(isValue(new String(''))).toBe(true);
    });
    it('should succeed if boolean', () => {
      expect(isValue(true)).toBe(true);
      expect(isValue(false)).toBe(true);
      expect(isValue(new Boolean(true))).toBe(true);
      expect(isValue(new Boolean(false))).toBe(true);
    });
  });
});