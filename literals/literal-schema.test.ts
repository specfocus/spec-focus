import bool from '../booleans';
import lazy from '../lazy';
import literal from '../literals';
import LiteralSchema from '../literals/literal-schema';
import array from '../many';
import number from '../numbers';
import shape from '../shapes';
import reach from '../objects/reach';
import ref from '../references';
import string from '../strings';
import { ValidationError } from '../validations/error';
import * as TestHelpers from '../__test__/test-helpers';
import { ensureSync } from '../__test__/test-helpers';

let noop = () => { };

// @ts-ignore
global.YUP_USE_SYNC &&
  it('[internal] normal methods should be running in sync Mode', async () => {
    let schema = number();

    // test negative ensure case
    await expect(ensureSync(() => Promise.resolve())).rejects.toThrowError(
      Error,
      // @ts-ignore
      'Did not execute synchronously',
    );

    // test positive case
    await expect(ensureSync(() => schema.isValid(1))).resolves.toBe(true);

    // ensure it fails with the correct message in sync mode
    await expect(
      ensureSync(() => schema.validate('john')),
    ).rejects.toThrowError(
      /the final value was: `NaN`.+cast from the value `"john"`/,
    );
  });

describe('Mixed Types ', () => {
  xit('should be immutable', () => {
    let inst = literal(),
      next;
    // @ts-ignore
    let sub = (inst.sub = literal());

    expect(inst).not.toBe((next = inst.required()));

    // @ts-ignore
    expect(next.sub).toBe(sub);
    // @ts-ignore
    expect(inst.sub).toBe(next.sub);

    expect(inst).toBeInstanceOf(LiteralSchema);
    expect(next).toBeInstanceOf(LiteralSchema);

    return Promise.all([
      // @ts-ignore
      expect(inst.isValid()).resolves.toBe(true),
      next.isValid(null),
    ]);
  });

  it('cast should return a default when undefined', () => {
    let inst = literal().default('hello');

    expect(inst.cast(undefined)).toBe('hello');
  });

  it('getDefault should return the default value', function () {
    let inst = string().default('hi');
    expect(inst.getDefault({})).toBe('hi');
    expect(inst.getDefault()).toBe('hi');
  });

  it('getDefault should return the default value using context', function () {
    let inst = string().when('$foo', {
      is: 'greet',
      then: string().default('hi'),
    });
    expect(inst.getDefault({ context: { foo: 'greet' } })).toBe('hi');
  });

  it('should warn about null types', async () => {
    await expect(string().strict().validate(null)).rejects.toThrowError(
      /this cannot be null/,
    );
  });

  it('should validateAt', async () => {
    const schema = shape({
      foo: array().of(
        shape({
          loose: bool(),
          bar: string().when('loose', {
            is: true,
            otherwise: (s) => s.strict(),
          }),
        }),
      ),
    });
    const value = {
      foo: [{ bar: 1 }, { bar: 1, loose: true }],
    };

    await expect(schema.validateAt('foo[1].bar', value)).resolves.toBeDefined();

    await expect(schema.validateAt('foo[0].bar', value)).rejects.toThrowError(
      /bar must be a `string` type/,
    );
  });

  // xit('should castAt', async () => {
  //   const schema = object({
  //     foo: array().of(
  //       object({
  //         loose: bool().default(true),
  //         bar: string(),
  //       }),
  //     ),
  //   });
  //   const value = {
  //     foo: [{ bar: 1 }, { bar: 1, loose: true }],
  //   };

  //   schema.castAt('foo[1].bar', value).should.equal('1');

  //   schema.castAt('foo[0].loose', value).should.equal(true);
  // });

  it('should print the original value', async () => {
    await expect(number().validate('john')).rejects.toThrowError(
      /the final value was: `NaN`.+cast from the value `"john"`/,
    );
  });

  it('should allow function messages', async () => {
    await expect(
      string()
        .label('My string')
        .required((d) => `${d.label} is required`)
        // @ts-ignore
        .validate(),
    ).rejects.toThrowError(/My string is required/);
  });

  it('should check types', async () => {
    let inst = string().strict().typeError('must be a ${type}!');

    await expect(inst.validate(5)).rejects.toEqual(
      expect.objectContaining({
        type: 'typeError',
        message: 'must be a string!',
        inner: [],
      }),
    );

    await expect(inst.validate(5, { abortEarly: false })).rejects.toEqual(
      expect.objectContaining({
        type: undefined,
        message: 'must be a string!',
        inner: [expect.any(ValidationError)],
      }),
    );
  });

  it('should limit values', async () => {
    let inst = literal().oneOf([5, 'hello']);

    await expect(inst.isValid(5)).resolves.toBe(true);
    await expect(inst.isValid('hello')).resolves.toBe(true);

    await expect(inst.validate(6)).rejects.toThrowError(
      'this must be one of the following values: 5, hello',
    );
  });

  it('should limit values with a ref', async () => {
    let someValues = [1, 2, 3];
    let context = { someValues };
    let inst = literal().oneOf([
      ref('$someValues[0]'),
      ref('$someValues[1]'),
      ref('$someValues[2]'),
    ]);
    await expect(inst.validate(1, { context })).resolves.toBe(1);

    await expect(inst.validate(4, { context })).rejects.toEqual(
      expect.objectContaining({
        type: 'oneOf',
        params: expect.objectContaining({ resolved: someValues }),
      }),
    );
  });

  it('should not require field when notRequired was set', async () => {
    let inst = literal().required();

    await expect(inst.isValid('test')).resolves.toBe(true);
    await expect(inst.isValid(1)).resolves.toBe(true);

    // @ts-ignore
    await expect(inst.validate()).rejects.toThrowError(
      'this is a required field',
    );

    inst = inst.notRequired();

    // @ts-ignore
    await expect(inst.isValid()).resolves.toBe(true);
  });

  // @ts-ignore
  global.YUP_USE_SYNC &&
    describe('synchronous methods', () => {
      it('should validate synchronously', async () => {
        let schema = number();

        expect(schema.isValidSync('john')).toBe(false);

        expect(() => schema.validateSync('john')).toThrowError(
          /the final value was: `NaN`.+cast from the value `"john"`/,
        );
      });

      it('should isValid synchronously', async () => {
        let schema = number();

        expect(schema.isValidSync('john')).toBe(false);
      });

      it('should throw on async test', async () => {
        // @ts-ignore
        let schema = literal().test('test', 'foo', () => Promise.resolve());

        await expect(
          ensureSync(() => schema.validate('john')),
        ).rejects.toThrowError(/Validation test of type: "test"/);
      });
    });

  describe('oneOf', () => {
    let inst = literal().oneOf(['hello']);

    TestHelpers.validateAll(inst, {
      valid: [undefined, 'hello'],
      invalid: [
        'YOLO',
        [undefined, inst.required(), 'required'],
        [null, inst.nullable()],
        [null, inst.nullable().required(), 'required'],
      ],
    });

    it('should work with refs', async () => {
      let inst = shape({
        foo: string(),
        bar: string().oneOf([ref('foo'), 'b']),
      });

      await expect(
        inst.validate({ foo: 'a', bar: 'a' }),
      ).resolves.toBeDefined();

      await expect(
        inst.validate({ foo: 'foo', bar: 'bar' }),
      ).rejects.toThrowError();
    });
  });

  describe('should exclude values', () => {
    let inst = literal().nullable().notOneOf([5, 'hello']);

    TestHelpers.validateAll(inst, {
      valid: [6, 'hfhfh', [5, inst.oneOf([5]), '`oneOf` called after'], null],
      invalid: [5, [null, inst.required(), 'required schema']],
    });

    it('should throw the correct error', async () => {
      await expect(inst.validate(5)).rejects.toThrowError(
        'this must not be one of the following values: 5, hello',
      );
    });
  });

  it('should run subset of validations first', async () => {
    let called = false;
    let inst = string()
      .strict()
      .test('test', 'boom', () => (called = true));

    await expect(inst.validate(25)).rejects.toThrowError();

    expect(called).toBe(false);
  });

  it('should respect strict', () => {
    let inst = string().equals(['hello', '5']);

    return Promise.all([
      expect(inst.isValid(5)).resolves.toBe(true),
      expect(inst.strict().isValid(5)).resolves.toBe(false),
    ]);
  });

  it('should respect abortEarly', () => {
    let inst = string().trim().min(10);

    return Promise.all([
      expect(inst.strict().validate(' hi ')).rejects.toThrowError(
        /must be a trimmed string/,
      ),

      expect(
        inst.strict().validate(' hi ', { abortEarly: false }),
      ).rejects.toThrowError(/2 errors/),
    ]);
  });

  it('should overload test()', () => {
    // @ts-ignore
    let inst = literal().test('test', noop);

    expect(inst.tests).toHaveLength(1);
    expect(inst.tests[0].OPTIONS.test).toBe(noop);
    expect(inst.tests[0].OPTIONS.message).toBe('${path} is invalid');
  });

  it('should fallback to default message', async () => {
    let inst = literal().test(() => false);

    await expect(inst.validate('foo')).rejects.toThrowError(
      ValidationError,
      // @ts-ignore
      'this is invalid',
    );
  });

  it('should allow non string messages', async () => {
    let message = { key: 'foo' };
    let inst = literal().test('test', message, () => false);

    expect(inst.tests).toHaveLength(1);
    expect(inst.tests[0].OPTIONS.message).toBe(message);

    let err = await inst.validate('foo').catch((err) => err);
    expect(err.message).toEqual(message);
  });

  it('should dedupe tests with the same test function', () => {
    // @ts-ignore
    let inst = literal().test('test', ' ', noop).test('test', 'asdasd', noop);

    expect(inst.tests).toHaveLength(1);
    expect(inst.tests[0].OPTIONS.message).toBe('asdasd');
  });

  it('should not dedupe tests with the same test function and different type', () => {
    // @ts-ignore
    let inst = literal().test('test', ' ', noop).test('test-two', 'asdasd', noop);

    expect(inst.tests).toHaveLength(2);
  });

  it('should respect exclusive validation', () => {
    // @ts-ignore
    let inst = literal()
      .test({
        message: 'invalid',
        exclusive: true,
        name: 'test',
        test: () => { },
      })
      .test({ message: 'also invalid', name: 'test', test: () => { } });

    expect(inst.tests).toHaveLength(1);

    // @ts-ignore
    inst = literal()
      .test({ message: 'invalid', name: 'test', test: () => { } })
      .test({ message: 'also invalid', name: 'test', test: () => { } });

    expect(inst.tests).toHaveLength(2);
  });

  it('should non-exclusive tests should stack', () => {
    // @ts-ignore
    let inst = literal()
      .test({ name: 'test', message: ' ', test: () => { } })
      .test({ name: 'test', message: ' ', test: () => { } });

    expect(inst.tests).toHaveLength(2);
  });

  it('should replace existing tests, with exclusive test ', () => {
    // @ts-ignore
    let inst = literal()
      .test({ name: 'test', message: ' ', test: noop })
      .test({ name: 'test', exclusive: true, message: ' ', test: noop });

    expect(inst.tests).toHaveLength(1);
  });

  it('should replace existing exclusive tests, with non-exclusive', () => {
    // @ts-ignore
    let inst = literal()
      .test({ name: 'test', exclusive: true, message: ' ', test: () => { } })
      .test({ name: 'test', message: ' ', test: () => { } })
      .test({ name: 'test', message: ' ', test: () => { } });

    expect(inst.tests).toHaveLength(2);
  });

  it('exclusive tests should throw without a name', () => {
    expect(() => {
      // @ts-ignore
      literal().test({ message: 'invalid', exclusive: true, test: noop });
    }).toThrowError();
  });

  it('exclusive tests should replace previous ones', async () => {
    let inst = literal().test({
      message: 'invalid',
      exclusive: true,
      name: 'max',
      test: (v) => v < 5,
    });

    expect(await inst.isValid(8)).toBe(false);

    expect(
      await inst
        .test({
          message: 'invalid',
          exclusive: true,
          name: 'max',
          test: (v) => v < 10,
        })
        .isValid(8),
    ).toBe(true);
  });

  it('tests should be called with the correct `this`', async () => {
    let called = false;
    let inst = shape({
      other: literal(),
      test: literal().test({
        message: 'invalid',
        exclusive: true,
        name: 'max',
        test() {
          expect(this.path).toBe('test');
          expect(this.parent).toEqual({ other: 5, test: 'hi' });
          expect(this.options.context).toEqual({ user: 'jason' });
          called = true;
          return true;
        },
      }),
    });

    await inst.validate(
      { other: 5, test: 'hi' },
      { context: { user: 'jason' } },
    );

    expect(called).toBe(true);
  });

  it('tests should be able to access nested parent', async () => {
    let finalFrom, finalOptions;
    let testFixture = {
      firstField: 'test',
      second: [
        {
          thirdField: 'test3',
        },
        {
          thirdField: 'test4',
        },
      ],
    };

    let third = shape({
      thirdField: literal().test({
        test() {
          // @ts-ignore
          finalFrom = this.from;
          finalOptions = this.options;
          return true;
        },
      }),
    });

    let second = array().of(third);

    let first = shape({
      firstField: literal(),
      second,
    });

    await first.validate(testFixture);
    // console.log(finalFrom);
    // @ts-ignore
    expect(finalFrom[0].value).toEqual(testFixture.second[finalOptions.index]);
    // @ts-ignore
    expect(finalFrom[0].schema).toBe(third);
    // @ts-ignore
    expect(finalFrom[1].value).toBe(testFixture);
    // @ts-ignore
    expect(finalFrom[1].schema).toBe(first);
  });

  it('tests can return an error', () => {
    let inst = literal().test({
      message: 'invalid ${path}',
      name: 'max',
      test() {
        return this.createError({ path: 'my.path' });
      },
    });

    return expect(inst.validate('')).rejects.toEqual(
      expect.objectContaining({
        path: 'my.path',
        errors: ['invalid my.path'],
      }),
    );
  });

  it('should use returned error path and message', () => {
    let inst = literal().test({
      message: 'invalid ${path}',
      name: 'max',
      test: function () {
        return this.createError({ message: '${path} nope!', path: 'my.path' });
      },
    });

    return expect(inst.validate({ other: 5, test: 'hi' })).rejects.toEqual(
      expect.objectContaining({
        path: 'my.path',
        errors: ['my.path nope!'],
      }),
    );
  });

  it('should allow custom validation', async () => {
    let inst = string().test('name', 'test a', (val) => val === 'jim');

    return expect(inst.validate('joe')).rejects.toThrowError('test a');
  });

  // @ts-ignore
  !global.YUP_USE_SYNC &&
    it('should fail when the test function returns a rejected Promise', async () => {
      let inst = string().test(() => {
        return Promise.reject(new Error('oops an error occurred'));
      });

      return expect(inst.validate('joe')).rejects.toThrowError(
        'oops an error occurred',
      );
    });

  describe('withMutation', () => {
    it('should pass the same instance to a provided function', () => {
      let inst = literal();
      let func = jest.fn();

      inst.withMutation(func);

      expect(func).toHaveBeenCalledWith(inst);
    });

    it('should temporarily make mutable', () => {
      let inst = literal();

      expect(inst.tests).toHaveLength(0);

      inst.withMutation((inst) => {
        inst.test('a', () => true);
      });

      expect(inst.tests).toHaveLength(1);
    });

    it('should return immutability', () => {
      let inst = literal();
      inst.withMutation(() => { });

      expect(inst.tests).toHaveLength(0);

      inst.test('a', () => true);

      expect(inst.tests).toHaveLength(0);
    });

    it('should work with nesting', () => {
      let inst = literal();

      expect(inst.tests).toHaveLength(0);

      inst.withMutation((inst) => {
        inst.withMutation((inst) => {
          inst.test('a', () => true);
        });
        inst.test('b', () => true);
      });

      expect(inst.tests).toHaveLength(2);
    });
  });

  describe('concat', () => {
    // @ts-ignore
    let next;
    let inst = shape({
      str: string().required(),
      obj: shape({
        str: string(),
      }),
    });

    beforeEach(() => {
      next = inst.concat(
        shape({
          str: string().required().trim(),
          str2: string().required(),
          obj: shape({
            str: string().required(),
          }),
        }),
      );
    });

    it('should have the correct number of tests', () => {
      // @ts-ignore
      expect(reach(next, 'str').tests).toHaveLength(2);
    });

    it('should have the tests in the correct order', () => {
      // @ts-ignore
      expect(reach(next, 'str').tests[0].OPTIONS.name).toBe('required');
    });

    it('should validate correctly', async () => {
      await expect(
        inst.isValid({ str: 'hi', str2: 'hi', obj: {} }),
      ).resolves.toBe(true);

      await expect(
        // @ts-ignore
        next.validate({ str: ' hi  ', str2: 'hi', obj: { str: 'hi' } }),
      ).resolves.toEqual({
        str: 'hi',
        str2: 'hi',
        obj: { str: 'hi' },
      });
    });

    it('should throw the correct validation errors', async () => {
      await expect(
        // @ts-ignore
        next.validate({ str: 'hi', str2: 'hi', obj: {} }),
      ).rejects.toThrowError('obj.str is a required field');

      await expect(
        // @ts-ignore
        next.validate({ str2: 'hi', obj: { str: 'hi' } }),
      ).rejects.toThrowError('str is a required field');
    });
  });

  it('concat should carry over transforms', async () => {
    let inst = string().trim();

    await expect(inst.concat(string().min(4)).cast(' hello  ')).toBe('hello');

    await expect(inst.concat(string().min(4)).isValid(' he  ')).resolves.toBe(
      false,
    );
  });

  it('concat should fail on different types', function () {
    let inst = string().default('hi');

    expect(function () {
      // @ts-ignore
      inst.concat(shape());
    }).toThrowError(TypeError);
  });

  it('concat should not overwrite label and meta with undefined', function () {
    const testLabel = 'Test Label';
    const testMeta = {
      testField: 'test field',
    };
    let baseSchema = literal().label(testLabel).meta(testMeta);
    const otherSchema = literal();

    baseSchema = baseSchema.concat(otherSchema);
    expect(baseSchema.spec.label).toBe(testLabel);
    expect(baseSchema.spec.meta.testField).toBe(testMeta.testField);
  });

  it('concat should allow mixed and other type', function () {
    let inst = literal().default('hi');

    expect(function () {
      expect(inst.concat(string())._type).toBe('string');
    }).not.toThrowError(TypeError);
  });

  it('concat should validate with mixed and other type', async function () {
    let inst = literal().concat(number());

    await expect(inst.validate([])).rejects.toThrowError(
      ValidationError,
      // @ts-ignore
      /should be a `number`/,
    );
  });

  it('concat should maintain undefined defaults', function () {
    let inst = string().default('hi');

    expect(
      inst.concat(string().default(undefined)).getDefault(),
    ).toBeUndefined();
  });

  it('concat should preserve oneOf', async function () {
    let inst = string().oneOf(['a']).concat(string().default('hi'));

    await expect(inst.isValid('a')).resolves.toBe(true);
  });

  // xit('concat should maintain explicit nullability', async function () {
  //   let inst = string().nullable().concat(string().default('hi'));

  //   await inst.isValid(null).should.resolves.toBe(true);
  // });

  it('concat should maintain explicit presence', async function () {
    let inst = string().required().concat(string());

    await expect(inst.isValid(undefined)).resolves.toBe(false);
  });

  it('gives whitelist precedence to second in concat', async function () {
    let inst = string()
      .oneOf(['a', 'b', 'c'])
      .concat(string().notOneOf(['b']));

    await expect(inst.isValid('a')).resolves.toBe(true);
    await expect(inst.isValid('b')).resolves.toBe(false);
    await expect(inst.isValid('c')).resolves.toBe(true);
  });

  it('gives blacklist precedence to second in concat', async function () {
    let inst = string()
      .notOneOf(['a', 'b', 'c'])
      .concat(string().oneOf(['b', 'c']));

    await expect(inst.isValid('a')).resolves.toBe(false);
    await expect(inst.isValid('b')).resolves.toBe(true);
    await expect(inst.isValid('c')).resolves.toBe(true);
  });

  it('concats whitelist with refs', async function () {
    let inst = shape({
      x: string().required(),
      y: string()
        .oneOf([ref('$x'), 'b', 'c'])
        .concat(string().notOneOf(['c', ref('$x')])),
    });

    await expect(inst.isValid({ x: 'a', y: 'a' })).resolves.toBe(false);
    await expect(inst.isValid({ x: 'a', y: 'b' })).resolves.toBe(true);
    await expect(inst.isValid({ x: 'a', y: 'c' })).resolves.toBe(false);
  });

  it('defaults should be validated but not transformed', function () {
    let inst = string().trim().default('  hi  ');

    return expect(inst.validate(undefined)).rejects.toThrowError(
      'this must be a trimmed string',
    );
  });

  it('should handle conditionals', async function () {
    let inst = literal().when('prop', {
      is: 5,
      then: literal().required('from parent'),
    });

    await expect(
      // @ts-ignore
      inst.validate(undefined, { parent: { prop: 5 } }),
    ).rejects.toThrowError();
    await expect(
      // @ts-ignore
      inst.validate(undefined, { parent: { prop: 1 } }),
    ).resolves.toBeUndefined();
    await expect(
      // @ts-ignore
      inst.validate('hello', { parent: { prop: 5 } }),
    ).resolves.toBeDefined();

    // @ts-ignore
    inst = string().when('prop', {
      // @ts-ignore
      is: function (val) {
        return val === 5;
      },
      then: string().required(),
      otherwise: string().min(4),
    });

    await expect(
      // @ts-ignore
      inst.validate(undefined, { parent: { prop: 5 } }),
    ).rejects.toThrowError();
    await expect(
      // @ts-ignore
      inst.validate('hello', { parent: { prop: 1 } }),
    ).resolves.toBeDefined();
    await expect(
      // @ts-ignore
      inst.validate('hel', { parent: { prop: 1 } }),
    ).rejects.toThrowError();
  });

  it('should handle multiple conditionals', function () {
    let called = false;
    // @ts-ignore
    let inst = literal().when(['$prop', '$other'], function (prop, other) {
      expect(other).toBe(true);
      expect(prop).toBe(1);
      called = true;
    });

    inst.cast({}, { context: { prop: 1, other: true } });
    expect(called).toBe(true);

    inst = literal().when(['$prop', '$other'], {
      is: 5,
      then: literal().required(),
    });

    return expect(
      inst.isValid(undefined, { context: { prop: 5, other: 5 } }),
    ).resolves.toBe(false);
  });

  it('should require context when needed', async function () {
    let inst = literal().when('$prop', {
      is: 5,
      then: literal().required('from context'),
    });

    await expect(
      inst.validate(undefined, { context: { prop: 5 } }),
    ).rejects.toThrowError();
    await expect(
      inst.validate(undefined, { context: { prop: 1 } }),
    ).resolves.toBeUndefined();
    await expect(
      inst.validate('hello', { context: { prop: 5 } }),
    ).resolves.toBeDefined();
    // @ts-ignore
    inst = string().when('$prop', {
      // @ts-ignore
      is: function (val) {
        return val === 5;
      },
      then: string().required(),
      otherwise: string().min(4),
    });

    await expect(
      inst.validate(undefined, { context: { prop: 5 } }),
    ).rejects.toThrowError();
    await expect(
      inst.validate('hello', { context: { prop: 1 } }),
    ).resolves.toBeDefined();
    await expect(
      inst.validate('hel', { context: { prop: 1 } }),
    ).rejects.toThrowError();
  });

  it('should not use context refs in object calculations', function () {
    let inst = shape({
      prop: string().when('$prop', {
        is: 5,
        then: string().required('from context'),
      }),
    });

    expect(inst.getDefault()).toEqual({ prop: undefined });
  });

  it('should support self references in conditions', async function () {
    let inst = number().when('.', {
      // @ts-ignore
      is: (value) => value > 0,
      then: number().min(5),
    });

    await expect(inst.validate(4)).rejects.toThrowError(
      ValidationError,
      // @ts-ignore
      /must be greater/,
    );

    await expect(inst.validate(5)).resolves.toBeDefined();

    await expect(inst.validate(-1)).resolves.toBeDefined();
  });

  it('should support conditional single argument as options shortcut', async function () {
    let inst = number().when({
      // @ts-ignore
      is: (value) => value > 0,
      then: number().min(5),
    });

    await expect(inst.validate(4)).rejects.toThrowError(
      ValidationError,
      // @ts-ignore
      /must be greater/,
    );

    await expect(inst.validate(5)).resolves.toBeDefined();

    await expect(inst.validate(-1)).resolves.toBeDefined();
  });

  it('should allow nested conditions and lazies', async function () {
    let inst = string().when('$check', {
      // @ts-ignore
      is: (value) => typeof value === 'string',
      then: string().when('$check', {
        // @ts-ignore
        is: (value) => /hello/.test(value),
        then: lazy(() => string().min(6)),
      }),
    });

    await expect(
      inst.validate('pass', { context: { check: false } }),
    ).resolves.toBeDefined();

    await expect(
      inst.validate('pass', { context: { check: 'hello' } }),
      // @ts-ignore
    ).rejects.toThrowError(ValidationError, /must be at least/);

    await expect(
      inst.validate('passes', { context: { check: 'hello' } }),
    ).resolves.toBeDefined();
  });

  it('should use label in error message', async function () {
    let label = 'Label';
    let inst = shape({
      prop: string().required().label(label),
    });

    await expect(inst.validate({})).rejects.toThrowError(
      `${label} is a required field`,
    );
  });

  it('should add meta() data', () => {
    expect(string().meta({ input: 'foo' }).meta({ foo: 'bar' }).meta()).toEqual(
      {
        input: 'foo',
        foo: 'bar',
      },
    );
  });

  describe('schema.describe()', () => {
    // @ts-ignore
    let schema;
    beforeEach(() => {
      schema = shape({
        lazy: lazy(() => string().nullable()),
        foo: array(number().integer()).required(),
        bar: string()
          .max(2)
          .meta({ input: 'foo' })
          .label('str!')
          .oneOf(['a', 'b'])
          .notOneOf([ref('foo')])
          .when('lazy', {
            is: 'entered',
            then: (s) => s.defined(),
          }),
      });
    });

    it('should describe', () => {
      // @ts-ignore
      expect(schema.describe()).toEqual({
        type: 'object',
        meta: undefined,
        label: undefined,
        nullable: false,
        optional: true,
        tests: [],
        oneOf: [],
        notOneOf: [],
        fields: {
          lazy: {
            type: 'lazy',
            meta: undefined,
            label: undefined,
          },
          foo: {
            type: 'array',
            meta: undefined,
            label: undefined,
            nullable: false,
            optional: false,
            tests: [
              {
                name: 'required',
                params: undefined,
              },
            ],
            oneOf: [],
            notOneOf: [],
            innerType: {
              type: 'number',
              meta: undefined,
              label: undefined,
              nullable: false,
              optional: true,
              oneOf: [],
              notOneOf: [],
              tests: [
                {
                  name: 'integer',
                  params: undefined,
                },
              ],
            },
          },
          bar: {
            type: 'string',
            label: 'str!',
            tests: [{ name: 'max', params: { max: 2 } }],
            meta: {
              input: 'foo',
            },
            nullable: false,
            optional: true,
            oneOf: ['a', 'b'],
            notOneOf: [
              {
                type: 'ref',
                key: 'foo',
              },
            ],
          },
        },
      });
    });

    it('should describe with options', () => {
      // @ts-ignore
      expect(schema.describe({ value: { lazy: 'entered' } })).toEqual({
        type: 'object',
        meta: undefined,
        label: undefined,
        nullable: false,
        optional: true,
        tests: [],
        oneOf: [],
        notOneOf: [],
        fields: {
          lazy: {
            type: 'string',
            meta: undefined,
            label: undefined,
            nullable: true,
            optional: true,
            oneOf: [],
            notOneOf: [],
            tests: [],
          },
          foo: {
            type: 'array',
            meta: undefined,
            label: undefined,
            nullable: false,
            optional: false,
            tests: [
              {
                name: 'required',
                params: undefined,
              },
            ],
            oneOf: [],
            notOneOf: [],
            innerType: {
              type: 'number',
              meta: undefined,
              label: undefined,
              nullable: false,
              optional: true,
              oneOf: [],
              notOneOf: [],
              tests: [
                {
                  name: 'integer',
                  params: undefined,
                },
              ],
            },
          },
          bar: {
            type: 'string',
            label: 'str!',
            tests: [{ name: 'max', params: { max: 2 } }],
            meta: {
              input: 'foo',
            },
            nullable: false,
            optional: false,
            oneOf: ['a', 'b'],
            notOneOf: [
              {
                type: 'ref',
                key: 'foo',
              },
            ],
          },
        },
      });
    });
  });

  describe('defined', () => {
    it('should fail when value is undefined', async () => {
      let inst = shape({
        prop: string().defined(),
      });

      await expect(inst.validate({})).rejects.toThrowError(
        'prop must be defined',
      );
    });

    it('should pass when value is null', async () => {
      let inst = shape({
        prop: string().nullable().defined(),
      });

      await expect(inst.isValid({ prop: null })).resolves.toBe(true);
    });

    it('should pass when value is not undefined', async () => {
      let inst = shape({
        prop: string().defined(),
      });

      await expect(inst.isValid({ prop: 'prop value' })).resolves.toBe(true);
    });
  });
});
