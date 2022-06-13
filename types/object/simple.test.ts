import { isSimpleObject } from './simple';

describe('objects', () => {
  describe('isSimpleObject', () => {
    it('should succeed if Record', () => {
      expect(isSimpleObject({})).toBe(true);
    });
    it('should succeed if new Object', () => {
      expect(isSimpleObject(new Object)).toBe(true);
    });
    it('should fail if contains Function', () => {
      expect(isSimpleObject({ fn: () => {} })).toBe(false);
    });
    it('should succeed if contains undefined', () => {
      expect(isSimpleObject({ is: undefined })).toBe(true);
    });
    it('should succeed if contains null', () => {
      expect(isSimpleObject({ nill: null })).toBe(true);
    });
    it('should succeed if contains NaN', () => {
      expect(isSimpleObject({ nill: 1/0 })).toBe(true);
    });
    it('should succeed if contains simple array', () => {
      expect(isSimpleObject({ arr: [] })).toBe(true);
    });
    it('should succeed if contains date', () => {
      expect(isSimpleObject({ date: new Date })).toBe(true);
    });
    it('should succeed if contains number', () => {
      expect(isSimpleObject({ num: 1 })).toBe(true);
      expect(isSimpleObject({ num: new Number(1) })).toBe(true);
    });
    it('should succeed if contains string', () => {
      expect(isSimpleObject({ s: '' })).toBe(true);
      expect(isSimpleObject({ s: new String('') })).toBe(true);
    });
    it('should succeed if contains boolean', () => {
      expect(isSimpleObject({ true: true })).toBe(true);
      expect(isSimpleObject({ false: false })).toBe(true);
      expect(isSimpleObject({ true: new Boolean(true) })).toBe(true);
      expect(isSimpleObject({ false: new Boolean(false) })).toBe(true);
    });
  });
});