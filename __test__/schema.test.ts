import boolean from '../booleans';
import BooleanSchema from '../booleans/boolean-schema';
import date from '../dates';
import DateSchema from '../dates/date-schema';
import lazy from '../lazy';
import literal from '../literals';
import LiteralSchema from '../literals/literal-schema';
import array from '../many';
import ArraySchema from '../many/array-schema';
import number from '../numbers';
import NumberSchema from '../numbers/number-schema';
import reach, { getIn } from '../objects/reach';
import addMethod from '../schemas/add-method';
import shape from '../shapes';
import ObjectSchema from '../shapes/shape-schema';
import string from '../strings';
import StringSchema from '../strings/string-schema';
import { ValidationError } from '../validations/error';

describe('validation', () => {
  it('cast should not assert on undefined', () => {
    expect(() => string().cast(undefined)).not.toThrowError();
  });

  it('cast should assert on undefined cast results', () => {
    expect(() =>
      string()
        // @ts-ignore
        .toBeDefined()
        // @ts-ignore
        .transform(() => undefined)
        .cast('foo'),
    ).toThrowError();
  });

  it('cast should respect assert option', () => {
    expect(() => string().cast(null)).toThrowError();

    expect(() => string().cast(null, { assert: false })).not.toThrowError();
  });

  it('should getIn correctly', async () => {
    let num = number();
    let init = shape({ 'num-1': num });
    let inst = shape({
      num: number().max(4),

      nested: shape({
        arr: array().of(init),
      }),
    });

    const value = { nested: { arr: [{}, { 'num-1': 2 }] } };
    let { schema, parent, parentPath } = getIn(
      inst,
      'nested.arr[1].num-1',
      value,
    );

    expect(schema).toBe(num);
    expect(parentPath).toBe('num-1');
    expect(parent).toBe(value.nested.arr[1]);
  });

  it('should getIn array correctly', async () => {
    let num = number();
    let init = shape({ 'num-1': num });
    let inst = shape({
      num: number().max(4),

      nested: shape({
        arr: array().of(init),
      }),
    });

    const value = {
      nested: {
        arr: [{}, { 'num-1': 2 }],
      },
    };

    const { schema, parent, parentPath } = getIn(inst, 'nested.arr[1]', value);

    expect(schema).toBe(init);
    expect(parentPath).toBe('1');
    expect(parent).toBe(value.nested.arr);
  });

  it('should REACH correctly', async () => {
    let num = number();
    let init = shape({ num });

    let inst = shape({
      num: number().max(4),

      nested: shape({
        arr: array().of(init),
      }),
    });

    expect(reach(inst, '')).toBe(inst);

    expect(reach(inst, 'nested.arr[0].num')).toBe(num);
    expect(reach(inst, 'nested.arr[].num')).toBe(num);
    expect(reach(inst, 'nested.arr[1].num')).toBe(num);
    expect(reach(inst, 'nested.arr[1]')).toBe(init);

    expect(reach(inst, 'nested["arr"][1].num')).not.toBe(number());

    let valid = await reach(inst, 'nested.arr[0].num').isValid(5);
    expect(valid).toBe(true);
  });

  it('should REACH conditionally correctly', async () => {
    var num = number().oneOf([4]),
      inst = shape().shape({
        num: number().max(4),
        nested: shape().shape({
          arr: array().when('$bar', function (bar) {
            return bar !== 3
              ? array().of(number())
              : array().of(
                shape().shape({
                  foo: number(),
                  num: number().when('foo', (foo) => {
                    if (foo === 5) return num;
                  }),
                }),
              );
          }),
        }),
      });

    let context = { bar: 3 };
    let value = {
      bar: 3,
      nested: {
        arr: [{ foo: 5 }, { foo: 3 }],
      },
    };

    let options = {};
    // @ts-ignore
    options.parent = value.nested.arr[0];
    // @ts-ignore
    options.value = options.parent.num;
    expect(reach(inst, 'nested.arr.num', value).resolve(options)).toBe(num);
    expect(reach(inst, 'nested.arr[].num', value).resolve(options)).toBe(num);
    // @ts-ignore
    options.context = context;
    expect(reach(inst, 'nested.arr.num', value, context).resolve(options)).toBe(
      num,
    );
    expect(
      reach(inst, 'nested.arr[].num', value, context).resolve(options),
    ).toBe(num);
    expect(
      reach(inst, 'nested.arr[0].num', value, context).resolve(options),
    ).toBe(num);

    // // should fail b/c item[1] is used to resolve the schema
    // @ts-ignore
    options.parent = value.nested.arr[1];
    // @ts-ignore
    options.value = options.parent.num;
    expect(
      reach(inst, 'nested["arr"][1].num', value, context).resolve(options),
    ).not.toBe(num);

    let reached = reach(inst, 'nested.arr[].num', value, context);

    await expect(
      reached.validate(5, { context, parent: { foo: 4 } }),
    ).resolves.toBeDefined();

    await expect(
      reached.validate(5, { context, parent: { foo: 5 } }),
      // @ts-ignore
    ).rejects.toThrowError(ValidationError, /one of the following/);
  });

  it('should reach through lazy', async () => {
    let types = {
      1: shape({ foo: string() }),
      2: shape({ foo: number() }),
    };

    await expect(
      shape({
        // @ts-ignore
        x: array(lazy((val) => types[val.type])),
      })
        .strict()
        .validate({
          x: [
            { type: 1, foo: '4' },
            { type: 2, foo: '5' },
          ],
        }),
    ).rejects.toThrowError(/must be a `number` type/);
  });

  describe('addMethod', () => {
    it('extending mixed should make method accessible everywhere', () => {
      // @ts-ignore
      addMethod(literal, 'foo', () => 'here');
      // @ts-ignore
      expect(string().foo()).toBe('here');
    });

    it('extending Mixed should make method accessible everywhere', () => {
      // @ts-ignore
      addMethod(LiteralSchema, 'foo', () => 'here');
      // @ts-ignore
      expect(string().foo()).toBe('here');
    });

    test.each([
      ['object', shape],
      ['array', array],
      ['string', string],
      ['number', number],
      ['boolean', boolean],
      ['date', date],
    ])('should work with factories: %s', (_msg, factory) => {
      // @ts-ignore
      addMethod(factory, 'foo', () => 'here');
      // @ts-ignore
      expect(factory().foo()).toBe('here');
    });

    test.each([
      ['object', ObjectSchema],
      ['array', ArraySchema],
      ['string', StringSchema],
      ['number', NumberSchema],
      ['boolean', BooleanSchema],
      ['date', DateSchema],
    ])('should work with classes: %s', (_msg, ctor) => {
      // @ts-ignore
      addMethod(ctor, 'foo', () => 'here');
      // @ts-ignore
      expect(new ctor().foo()).toBe('here');
    });
  });
});
