import * as expr from './property-expr';
import * as compiler from './compiler';

const root: Record<string, any> = {};

function runSetterGetterTests({ setter, getter }: any) {
  const obj = {
    foo: {
      bar: ['baz', 'bux'],
      fux: 5,
      '00N40000002S5U0': 1,
      N40000002S5U0: 2,
      'FE43-D880-21AE': 3,
    },
  };

  // -- Getters --
  expect(getter('foo.fux')(obj)).toBe(5);
  expect(getter('foo.bar')(obj)).toEqual(['baz', 'bux']);

  expect(getter('foo.bar[1]')(obj)).toBe('bux');
  expect(getter('["foo"]["bar"][1]')(obj)).toBe('bux');
  expect(getter('[1]')([1, 'bux'])).toBe('bux');

  // safe access
  expect(getter('foo.fux', true)(obj)).toBe(5);
  expect(getter('foo.bar', true)(obj)).toEqual(['baz', 'bux']);

  expect(getter('foo.bar[1]', true)(obj)).toBe('bux');
  expect(getter('["foo"]["bar"][1]', true)(obj)).toBe('bux');
  expect(getter('[1]', true)([1, 'bux'])).toBe('bux');

  expect(getter('foo.gih.df[0]', true)(obj)).toBe(undefined);
  expect(getter('["fr"]["bzr"][1]', true)(obj)).toBe(undefined);

  expect(getter('foo["00N40000002S5U0"]', true)(obj)).toBe(1);
  expect(getter('foo.00N40000002S5U0', true)(obj)).toBe(1);
  expect(getter('foo["N40000002S5U0"]', true)(obj)).toBe(2);
  expect(getter('foo.N40000002S5U0', true)(obj)).toBe(2);
  expect(getter('foo["FE43-D880-21AE"]', true)(obj)).toBe(3);
  expect(getter('foo.FE43-D880-21AE', true)(obj)).toBe(3);

  // -- Setters --
  setter('foo.fux')(obj, 10);
  expect(obj.foo.fux).toBe(10);

  setter('foo.bar[1]')(obj, 'bot');
  expect(obj.foo.bar[1]).toBe('bot');

  setter('[\'foo\']["bar"][1]')(obj, 'baz');

  expect(obj.foo.bar[1]).toBe('baz')
    //
    ;['__proto__', 'constructor', 'prototype'].forEach((keyToTest) => {
      setter(`${keyToTest}.a`)({}, 'newValue');

      expect(root.a).not.toBe('newValue');

      const b = 'oldValue';

      expect(b).toBe('oldValue');
      expect(root.b).not.toBe('newValue');

      setter(`${keyToTest}.b`)({}, 'newValue');
      expect(b).toBe('oldValue');
      expect(root.b).not.toBe('newValue');
      expect(root.b).toBe(undefined);
    });
}

describe('property-expr', () => {
  describe('Cache', () => {
    const cache = new expr.Cache(3);
    it('should succeed', () => {
      expect(cache._size).toBe(0);
      expect(cache.set('a', expect)).toBe(expect);
      expect(cache.get('a')).toBe(expect);
      expect(cache._size).toBe(1);
      expect(cache.set('b', 123),).toBe(123);
      expect(cache.get('b')).toBe(123);
      expect(cache.set('b', 321)).toBe(321);
      expect(cache.get('b')).toBe(321);
      expect(cache.set('c', null)).toBe(null);
      expect(cache.get('c')).toBe(null);
      expect(cache._size).toBe(3);
      expect(cache.set('d', 444)).toBe(444);
      expect(cache._size).toBe(1);
      cache.clear();
      expect(cache._size).toBe(0);
      expect(cache.get('a')).toBe(undefined);
    });
  });

  describe('split', () => {
    const parts = expr.split('foo.baz["bar"][1]');
    it('should succeed', () => {
      expect(parts.length).toBe(4);
    });
  });

  describe('join', () => {
    const parts = expr.split('foo.baz["bar"][1]');
    it('should succeed', () => {
      expect(expr.join(['0', 'baz', '"bar"', '1'])).toBe('[0].baz["bar"][1]');

      expect(expr.join(parts)).toBe('foo.baz["bar"][1]');
    });
  });

  describe('forEach', () => {
    let count = 0;
    it('should succeed', () => {
      expr.forEach('foo.baz["bar"][1]', (part, isBracket, isArray, idx) => {
        count = idx;

        switch (idx) {
          case 0:
            expect(part).toBe('foo');
            expect(isBracket).toBe(false);
            expect(isArray).toBe(false);
            break;
          case 1:
            expect(part).toBe('baz');
            expect(isBracket).toBe(false);
            expect(isArray).toBe(false);
            break;
          case 2:
            expect(part).toBe('"bar"');
            expect(isBracket).toBe(true);
            expect(isArray).toBe(false);
            break;
          case 3:
            expect(part).toBe('1');
            expect(isBracket).toBe(false);
            expect(isArray).toBe(true);
            break;
        }
      });

      expect(count).toEqual(3);
    });
  });

  describe('normalizePath', () => {
    it('should succeed', () => {
      expect(
        expr.normalizePath('foo[ " bux\'s " ].bar["baz"][ 9 ][ \' s \' ]')
      ).toEqual(
        ['foo', " bux's ", 'bar', 'baz', '9', ' s ']
      );
    });
  });

  describe('expr setter/getter', () => {
    it('should succeed', () => runSetterGetterTests(expr));
  });

  describe('compiler setter/getter', () => {
    it('should succeed', () => runSetterGetterTests(compiler));
  });
});