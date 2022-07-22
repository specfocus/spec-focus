import bool from '../booleans';
import date from '../dates';
import lazy from '../lazy';
import literal from '../literals';
import LiteralSchema from '../literals/literal-schema';
import array from '../many';
import number from '../numbers';
import shape from '../shapes';
import ref from '../references';
import string from '../strings';
import StringSchema from '../strings/string-schema';
import { validationErrorWithMessages } from '../__test__/test-helpers';
import reach from '../objects/reach';

describe('Object types', () => {
  describe('casting', () => {
    // @ts-ignore
    let inst;

    beforeEach(() => {
      inst = shape({
        num: number(),
        str: string(),
        arr: array().of(number()),
        dte: date(),
        nested: shape().shape({ str: string() }),
        arrNested: array().of(shape().shape({ num: number() })),
        stripped: string().strip(),
      });
    });

    it('should parse json strings', () => {
      expect(shape({ hello: number() }).cast('{ "hello": "5" }')).toEqual({
        hello: 5,
      });
    });

    it('should return null for failed casts', () => {
      expect(shape().cast('dfhdfh', { assert: false })).toBeNull();
    });

    it('should recursively cast fields', () => {
      let obj = {
        num: '5',
        str: 'hello',
        arr: ['4', 5],
        dte: '2014-09-23T19:25:25Z',
        nested: { str: 5 },
        arrNested: [{ num: 5 }, { num: '5' }],
      };
      // @ts-ignore
      const cast = inst.cast(obj);

      expect(cast).toEqual({
        num: 5,
        str: 'hello',
        arr: [4, 5],
        dte: new Date(1411500325000),
        nested: { str: '5' },
        arrNested: [{ num: 5 }, { num: 5 }],
      });

      expect(cast.arrNested[0]).toBe(obj.arrNested[0]);
    });

    it('should return the same object if all props are already cast', () => {
      let obj = {
        num: 5,
        str: 'hello',
        arr: [4, 5],
        dte: new Date(1411500325000),
        nested: { str: '5' },
        arrNested: [{ num: 5 }, { num: 5 }],
      };
      // @ts-ignore
      expect(inst.cast(obj)).toBe(obj);
    });
  });

  describe('validation', () => {
    // @ts-ignore
    let inst, obj;

    beforeEach(() => {
      inst = shape().shape({
        num: number().max(4),
        str: string(),
        arr: array().of(number().max(6)),
        dte: date(),
        nested: shape()
          .shape({ str: string().min(3) })
          .required(),
        arrNested: array().of(shape().shape({ num: number() })),
      });
      obj = {
        num: '4',
        str: 'hello',
        arr: ['4', 5, 6],
        dte: '2014-09-23T19:25:25Z',
        nested: { str: 5 },
        arrNested: [{ num: 5 }, { num: '2' }],
      };
    });

    it('should run validations recursively', async () => {
      // @ts-ignore
      await expect(inst.isValid()).resolves.toBe(true);
      // @ts-ignore
      await expect(inst.validate(obj)).rejects.toEqual(
        validationErrorWithMessages(expect.stringContaining('nested.str')),
      );

      // @ts-ignore
      obj.nested.str = 'hello';
      // @ts-ignore
      obj.arr[1] = 8;
      // @ts-ignore
      await expect(inst.validate(obj)).rejects.toEqual(
        validationErrorWithMessages(expect.stringContaining('arr[1]')),
      );
    });

    it('should prevent recursive casting', async () => {
      // @ts-ignore
      let castSpy = jest.spyOn(StringSchema.prototype, '_cast');

      inst = shape({
        field: string(),
      });

      let value = await inst.validate({ field: 5 });

      expect(value.field).toBe('5');

      expect(castSpy).toHaveBeenCalledTimes(1);

      castSpy.mockRestore();
    });

    it('should respect strict for nested values', async () => {
      inst = shape({
        field: string(),
      }).strict();

      await expect(inst.validate({ field: 5 })).rejects.toThrowError(
        /must be a `string` type/,
      );
    });

    it('should respect strict for nested object values', async () => {
      inst = shape({
        obj: shape({
          field: string().strict(),
        }),
      });

      await expect(inst.validate({ obj: { field: 5 } })).rejects.toThrowError(
        /must be a `string` type/,
      );
    });

    it('should respect child schema with strict()', async () => {
      inst = shape({
        field: number().strict(),
      });

      await expect(inst.validate({ field: '5' })).rejects.toThrowError(
        /must be a `number` type/,
      );

      expect(inst.cast({ field: '5' })).toEqual({ field: 5 });

      await expect(
        shape({
          port: number().strict().integer(),
        }).validate({ port: 'asdad' }),
      ).rejects.toThrowError();
    });

    it('should handle custom validation', async () => {
      let inst = shape()
        .shape({
          prop: literal(),
          other: literal(),
        })
        .test('test', '${path} oops', () => false);

      await expect(inst.validate({})).rejects.toThrowError('this oops');
    });

    it('should not clone during validating', async function () {
      let base = LiteralSchema.prototype.clone;

      LiteralSchema.prototype.clone = function (...args) {
        if (!this._mutate) throw new Error('should not call clone');

        return base.apply(this, args);
      };

      try {
        // @ts-ignore
        await inst.validate({
          nested: { str: 'jimmm' },
          arrNested: [{ num: 5 }, { num: '2' }],
        });
        // @ts-ignore
        await inst.validate({
          nested: { str: 5 },
          arrNested: [{ num: 5 }, { num: '2' }],
        });
      } catch (err) {
        /* ignore */
      } finally {
        //eslint-disable-line
        LiteralSchema.prototype.clone = base;
      }
    });
  });

  it('should pass options to children', function () {
    expect(
      shape({
        names: shape({
          first: string(),
        }),
      }).cast(
        {
          extra: true,
          names: { first: 'john', extra: true },
        },
        { stripUnknown: true },
      ),
    ).toEqual({
      names: {
        first: 'john',
      },
    });
  });

  it('should call shape with constructed with an arg', () => {
    let inst = shape({
      prop: literal(),
    });

    expect(inst.fields.prop).toBeDefined();
  });

  describe('object defaults', () => {
    // @ts-ignore
    let objSchema;

    beforeEach(() => {
      objSchema = shape({
        nest: shape({
          str: string().default('hi'),
        }),
      });
    });

    it('should expand objects by default', () => {
      // @ts-ignore
      expect(objSchema.getDefault()).toEqual({
        nest: { str: 'hi' },
      });
    });

    it('should accept a user provided default', () => {
      // @ts-ignore
      objSchema = objSchema.default({ boom: 'hi' });

      expect(objSchema.getDefault()).toEqual({
        boom: 'hi',
      });
    });

    it('should add empty keys when sub schema has no default', () => {
      expect(
        shape({
          str: string(),
          nest: shape({ str: string() }),
        }).getDefault(),
      ).toEqual({
        nest: { str: undefined },
        str: undefined,
      });
    });

    it('should create defaults for missing object fields', () => {
      expect(
        shape({
          prop: literal(),
          other: shape({
            x: shape({ b: string() }),
          }),
        }).cast({ prop: 'foo' }),
      ).toEqual({
        prop: 'foo',
        other: { x: { b: undefined } },
      });
    });
  });

  it('should handle empty keys', () => {
    let inst = shape().shape({
      prop: literal(),
    });

    return Promise.all([
      expect(inst.isValid({})).resolves.toBe(true),

      expect(
        inst.shape({ prop: literal().required() }).isValid({}),
      ).resolves.toBe(false),
    ]);
  });

  it('should work with noUnknown', () => {
    let inst = shape().shape({
      prop: literal(),
      other: literal(),
    });

    return Promise.all([
      expect(
        // @ts-ignore
        inst.noUnknown('hi').validate({ extra: 'field' }, { strict: true }),
      ).rejects.toThrowError('hi'),

      expect(
        inst.noUnknown().validate({ extra: 'field' }, { strict: true }),
      ).rejects.toThrowError(/extra/),
    ]);
  });

  it('should work with noUnknown override', async () => {
    let inst = shape()
      .shape({
        prop: literal(),
      })
      .noUnknown()
      .noUnknown(false);

    await expect(inst.validate({ extra: 'field' })).resolves.toEqual({
      extra: 'field',
    });
  });

  it('should strip specific fields', () => {
    let inst = shape().shape({
      prop: literal().strip(false),
      other: literal().strip(),
    });

    expect(inst.cast({ other: 'boo', prop: 'bar' })).toEqual({
      prop: 'bar',
    });
  });

  it('should handle field striping with `when`', () => {
    let inst = shape().shape({
      other: bool(),
      prop: literal().when('other', {
        is: true,
        then: (s) => s.strip(),
      }),
    });

    expect(inst.cast({ other: true, prop: 'bar' })).toEqual({
      other: true,
    });
  });

  it('should allow refs', async function () {
    let schema = shape({
      quz: ref('baz'),
      baz: ref('foo.bar'),
      foo: shape({
        bar: string(),
      }),
      x: ref('$x'),
    });

    let value = await schema.validate(
      {
        foo: { bar: 'boom' },
      },
      { context: { x: 5 } },
    );

    //console.log(value)
    expect(value).toEqual({
      foo: {
        bar: 'boom',
      },
      baz: 'boom',
      quz: 'boom',
      x: 5,
    });
  });

  it('should allow refs with abortEarly false', async () => {
    let schema = shape().shape({
      field: string(),
      dupField: ref('field'),
    });

    await expect(
      schema.validate(
        {
          field: 'test',
        },
        { },
      ),
    ).resolves.toEqual({ field: 'test', dupField: 'test' });
  });

  describe('lazy evaluation', () => {
    let types = {
      string: string(),
      number: number(),
    };

    it('should be cast-able', () => {
      let inst = lazy(() => number());

      expect(inst.cast).toBeInstanceOf(Function);
      expect(inst.cast('4')).toBe(4);
    });

    it('should be validatable', async () => {
      let inst = lazy(() => string().trim('trim me!').strict());

      expect(inst.validate).toBeInstanceOf(Function);

      try {
        await inst.validate('  john  ');
      } catch (err) {
        expect(err.message).toBe('trim me!');
      }
    });

    it('should resolve to schema', () => {
      // @ts-ignore
      let inst = shape({
        nested: lazy(() => inst),
        x: shape({
          y: lazy(() => inst),
        }),
      });

      expect(reach(inst, 'nested').resolve({})).toBe(inst);
      expect(reach(inst, 'x.y').resolve({})).toBe(inst);
    });

    it('should be passed the value', (done) => {
      let inst = shape({
        nested: lazy((value) => {
          expect(value).toBe('foo');
          done();
          return string();
        }),
      });

      inst.cast({ nested: 'foo' });
    });

    it('should be passed the options', (done) => {
      let opts = {};
      let inst = lazy((_, options) => {
        expect(options).toBe(opts);
        done();
        return shape();
      });

      inst.cast({ nested: 'foo' }, opts);
    });

    it('should always return a schema', () => {
      // @ts-ignore
      expect(() => lazy(() => { }).cast()).toThrowError(
        /must return a valid schema/,
      );
    });

    it('should set the correct path', async () => {
      // @ts-ignore
      let inst = shape({
        str: string().required().nullable(),
        nested: lazy(() => inst.default(undefined)),
      });

      let value = {
        // @ts-ignore
        nested: { str: null },
        str: 'foo',
      };

      try {
        await inst.validate(value, { strict: true });
      } catch (err) {
        expect(err.path).toBe('nested.str');
        expect(err.message).toMatch(/required/);
      }
    });

    it('should set the correct path with dotted keys', async () => {
      // @ts-ignore
      let inst = shape({
        'dotted.str': string().required().nullable(),
        nested: lazy(() => inst.default(undefined)),
      });

      let value = {
        // @ts-ignore
        nested: { 'dotted.str': null },
        'dotted.str': 'foo',
      };

      try {
        await inst.validate(value, { strict: true });
      } catch (err) {
        expect(err.path).toBe('nested["dotted.str"]');
        expect(err.message).toMatch(/required/);
      }
    });

    it('should resolve array sub types', async () => {
      // @ts-ignore
      let inst = shape({
        str: string().required().nullable(),
        // @ts-ignore
        nested: array().of(lazy(() => inst.default(undefined))),
      });

      let value = {
        // @ts-ignore
        nested: [{ str: null }],
        str: 'foo',
      };

      try {
        await inst.validate(value, { strict: true });
      } catch (err) {
        expect(err.path).toBe('nested[0].str');
        expect(err.message).toMatch(/required/);
      }
    });

    it('should resolve for each array item', async () => {
      // @ts-ignore
      let inst = array().of(lazy((value) => types[typeof value]));

      let val = await inst.validate(['john', 4], { strict: true });

      expect(val).toEqual(['john', 4]);
    });
  });

  it('should respect abortEarly', () => {
    let inst = shape({
      nest: shape({
        str: string().required(),
      }).test('name', 'oops', () => false),
    });

    return Promise.all([
      expect(inst.validate({ nest: { str: '' } })).rejects.toEqual(
        expect.objectContaining({
          value: { nest: { str: '' } },
          path: 'nest',
          errors: ['oops'],
        }),
      ),

      expect(
        inst.validate({ nest: { str: '' } }, { }),
      ).rejects.toEqual(
        expect.objectContaining({
          value: { nest: { str: '' } },
          errors: ['nest.str is a required field', 'oops'],
        }),
      ),
    ]);
  });

  it('should sort errors by insertion order', async () => {
    let inst = shape({
      // use `when` to make sure it is validated second
      foo: string().when('bar', () => string().min(5)),
      bar: string().required(),
    });

    await expect(
      inst.validate({ foo: 'foo' }, { }),
    ).rejects.toEqual(
      validationErrorWithMessages(
        'foo must be at least 5 characters',
        'bar is a required field',
      ),
    );
  });

  it('should respect recursive', () => {
    let inst = shape({
      nest: shape({
        str: string().required(),
      }),
    }).test('name', 'oops', () => false);
    // @ts-ignore
    let val = { nest: { str: null } };

    return Promise.all([
      expect(inst.validate(val, { })).rejects.toEqual(
        validationErrorWithMessages(expect.any(String), expect.any(String)),
      ),

      expect(
        inst.validate(val, { recursive: false }),
      ).rejects.toEqual(validationErrorWithMessages('oops')),
    ]);
  });

  it('should alias or move keys', () => {
    let inst = shape()
      .shape({
        myProp: literal(),
        Other: literal(),
      })
      .from('prop', 'myProp')
      .from('other', 'Other', true);

    expect(inst.cast({ prop: 5, other: 6 })).toEqual({
      myProp: 5,
      other: 6,
      Other: 6,
    });
  });

  it('should alias nested keys', () => {
    let inst = shape({
      foo: shape({
        bar: string(),
      }),
      // @ts-ignore
    }).from('foo.bar', 'foobar', true);

    expect(inst.cast({ foo: { bar: 'quz' } })).toEqual({
      foobar: 'quz',
      foo: { bar: 'quz' },
    });
  });

  it('should not move keys when it does not exist', () => {
    let inst = shape()
      .shape({
        myProp: literal(),
      })
      .from('prop', 'myProp');

    expect(inst.cast({ myProp: 5 })).toEqual({ myProp: 5 });

    expect(inst.cast({ myProp: 5, prop: 7 })).toEqual({ myProp: 7 });
  });

  it('should handle conditionals', () => {
    let inst = shape().shape({
      noteDate: number()
        .when('stats.isBig', { is: true, then: number().min(5) })
        .when('other', function (v) {
          if (v === 4) return this.max(6);
        }),
      stats: shape({ isBig: bool() }),
      other: number().min(1).when('stats', { is: 5, then: number() }),
    });

    return Promise.all([
      expect(
        inst.isValid({
          stats: { isBig: true },
          rand: 5,
          noteDate: 7,
          other: 4,
        }),
      ).resolves.toBe(false),
      expect(
        inst.isValid({ stats: { isBig: true }, noteDate: 1, other: 4 }),
      ).resolves.toBe(false),

      expect(
        inst.isValid({ stats: { isBig: true }, noteDate: 7, other: 6 }),
      ).resolves.toBe(true),
      expect(
        inst.isValid({ stats: { isBig: true }, noteDate: 7, other: 4 }),
      ).resolves.toBe(false),

      expect(
        inst.isValid({ stats: { isBig: false }, noteDate: 4, other: 4 }),
      ).resolves.toBe(true),

      expect(
        inst.isValid({ stats: { isBig: true }, noteDate: 1, other: 4 }),
      ).resolves.toBe(false),
      expect(
        inst.isValid({ stats: { isBig: true }, noteDate: 6, other: 4 }),
      ).resolves.toBe(true),
    ]);
  });

  it('should handle conditionals with unknown dependencies', () => {
    let inst = shape().shape({
      value: number().when('isRequired', {
        is: true,
        then: number().required(),
      }),
    });

    return Promise.all([
      expect(
        inst.isValid({
          isRequired: true,
          value: 1234,
        }),
      ).resolves.toBe(true),
      expect(
        inst.isValid({
          isRequired: true,
        }),
      ).resolves.toBe(false),

      expect(
        inst.isValid({
          isRequired: false,
          value: 1234,
        }),
      ).resolves.toBe(true),
      expect(
        inst.isValid({
          value: 1234,
        }),
      ).resolves.toBe(true),
    ]);
  });

  it('should handle conditionals synchronously', () => {
    let inst = shape().shape({
      knownDependency: bool(),
      value: number().when(['unknownDependency', 'knownDependency'], {
        is: true,
        then: number().required(),
      }),
    });

    // expect(() =>
    //   inst.validateSync({
    //     unknownDependency: true,
    //     knownDependency: true,
    //     value: 1234,
    //   }),
    // ).not.throw();

    expect(() =>
      inst.validate({
        unknownDependency: true,
        knownDependency: true,
      }),
    ).toThrowError(/required/);
  });

  it('should allow opt out of topo sort on specific edges', () => {
    expect(() => {
      shape().shape({
        orgID: number().when('location', function (v) {
          if (v == null) return this.required();
        }),
        location: string().when('orgID', function (v) {
          if (v == null) return this.required();
        }),
      });
    }).toThrowError('Cyclic dependency, node was:"location"');

    expect(() => {
      shape().shape(
        {
          orgID: number().when('location', function (v) {
            if (v == null) return this.required();
          }),
          location: string().when('orgID', function (v) {
            if (v == null) return this.required();
          }),
        },
        [['location', 'orgID']],
      );
    }).not.toThrowError();
  });

  it('should use correct default when concating', () => {
    let inst = shape({
      other: bool(),
    }).default(undefined);

    expect(inst.concat(shape()).getDefault()).toBeUndefined();

    expect(inst.concat(shape().default({})).getDefault()).toEqual({});
  });

  it('should maintain excluded edges when concating', async () => {
    const schema = shape().shape(
      {
        a1: string().when('a2', {
          is: undefined,
          then: string().required(),
        }),
        a2: string().when('a1', {
          is: undefined,
          then: string().required(),
        }),
      },
      [['a1', 'a2']],
    );

    await expect(
      schema.concat(shape()).isValid({ a1: null }),
    ).resolves.toEqual(false);
  });

  it('should handle nested conditionals', () => {
    let countSchema = number().when('isBig', {
      is: true,
      then: number().min(5),
    });
    let inst = shape({
      other: bool(),
      stats: shape({
        isBig: bool(),
        count: countSchema,
      })
        .default(undefined)
        .when('other', { is: true, then: shape().required() }),
    });

    return Promise.all([
      expect(inst.validate({ stats: undefined, other: true })).rejects.toEqual(
        validationErrorWithMessages(expect.stringContaining('required')),
      ),
      expect(
        inst.validate({ stats: { isBig: true, count: 3 }, other: true }),
      ).rejects.toEqual(
        validationErrorWithMessages(
          'stats.count must be greater than or equal to 5',
        ),
      ),
      expect(
        inst.validate({ stats: { isBig: true, count: 10 }, other: true }),
      ).resolves.toEqual({
        stats: { isBig: true, count: 10 },
        other: true,
      }),

      expect(
        countSchema.validate(10, { context: { isBig: true } }),
      ).resolves.toEqual(10),
    ]);
  });

  it.skip('should camelCase keys', () => {
    let inst = shape()
      .shape({
        conStat: number(),
        caseStatus: number(),
        hiJohn: number(),
      })
      .camelCase();

    expect(inst.cast({ CON_STAT: 5, CaseStatus: 6, 'hi john': 4 })).toEqual({
      conStat: 5,
      caseStatus: 6,
      hiJohn: 4,
    });

    expect(inst.nullable().cast(null)).toBeNull();
  });

  it('should CONSTANT_CASE keys', () => {
    let inst = shape()
      .shape({
        CON_STAT: number(),
        CASE_STATUS: number(),
        HI_JOHN: number(),
      })
      .constantCase();

    expect(inst.cast({ conStat: 5, CaseStatus: 6, 'hi john': 4 })).toEqual({
      CON_STAT: 5,
      CASE_STATUS: 6,
      HI_JOHN: 4,
    });

    expect(inst.nullable().cast(null)).toBeNull();
  });

  it('should pick', async () => {
    let inst = shape({
      age: number().default(30).required(),
      name: string().default('pat').required(),
      color: string().default('red').required(),
    });

    expect(inst.pick(['age', 'name']).getDefault()).toEqual({
      age: 30,
      name: 'pat',
    });

    expect(
      await inst.pick(['age', 'name']).validate({ age: 24, name: 'Bill' }),
    ).toEqual({
      age: 24,
      name: 'Bill',
    });
  });

  it('should omit', async () => {
    let inst = shape({
      age: number().default(30).required(),
      name: string().default('pat').required(),
      color: string().default('red').required(),
    });

    expect(inst.omit(['age', 'name']).getDefault()).toEqual({
      color: 'red',
    });

    expect(
      await inst.omit(['age', 'name']).validate({ color: 'mauve' }),
    ).toEqual({ color: 'mauve' });
  });

  xit('should handle invalid shapes better', async () => {
    var schema = shape().shape({
      permissions: undefined,
    });

    expect(
      await schema.isValid({ permissions: [] }, { }),
    ).toBe(true);
  });
});
