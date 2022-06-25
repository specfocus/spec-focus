import clone from './clone';

it('Returns equal data for Null/undefined/functions/etc', () => {
  // Null
  expect(clone(null)).toBeNull()

  // Undefined
  expect(clone()).toBeUndefined()

  // Function
  const func = () => { }
  expect(clone(func)).toBe(func)

  // Etc: numbers and string
  expect(clone(5)).toBe(5)
  expect(clone('string')).toBe('string')
  expect(clone(false)).toBe(false)
  expect(clone(true)).toBe(true)
});

it('Returns equal data for Date', () => {
  const date = '2012-01-26T13:51:50.417Z'

  expect(clone(new Date(date))).toEqual(new Date(date))
})

it('Returns equal data for RegExp', () => {
  const regexp = /^$/

  expect(clone(regexp)).toEqual(regexp)
})

it('Returns equal data for Arrays', () => {
  const tests = [
    [5, 5, 8, 'string'], // Flat
    [5, 5, 8, { a: 'string' }, [7, 9]] // Attached
  ]

  tests.forEach(src => {
    const copy = clone(src)

    expect(src).toEqual(copy)
  })
})

it('Returns equal data for Object', () => {
  const src = {
    a: 5,
    b: 6
  }

  const copy = clone(src)

  expect(src).toEqual(copy)
})

it('Returns equal data for Map', () => {
  const src = new Map([['foo', 'bar']])

  const copy = clone(src)

  expect(src).toEqual(copy)
})

it('Returns equal data for Set', () => {
  const src = new Set(['foo', 'bar'])

  const copy = clone(src)

  expect(src).toEqual(copy)
})

test("Doesn't clone function", () => {
  const src = function b () { }

  const copy = clone(src)

  expect(copy).toBe(src)
})

test('Clones Date object', () => {
  var src = new Date()

  var copy = clone(src)

  copy.setHours(src.getHours() + 1) // +1 hour

  expect(copy.getHours()).not.toBe(src.getHours())
})

test('Clones RegExp', () => {
  var src = new RegExp('')

  var copy = clone(src)

  expect(copy).not.toBe(src)
})

test('Clones Array with nested data', () => {
  var src: any = [1, 'hello', [null, 'lalka']]

  var copy = clone(src)

  copy[2][0] = 'mutated'
  expect(src[2][0]).toBeNull()

  copy = copy.map(() => 'mutated')

  expect(src.every((i: any) => i !== 'mutated')).toBeTruthy()
})

test('Clones nested Arrays', () => {
  var src: any[] = [];
  src.push(src, 2, src, 3);

  var copy = clone(src)
  expect(copy[0]).toEqual(copy)
  expect(src[0]).toEqual(src)
  expect(copy[0]).not.toBe(src[0])
})

test('Clones nested Objects', () => {
  var src = { a: 1, b: { c: 1, d: [1, 2, 3] } }
  var srcValues = { a: 1, b: { c: 1, d: [1, 2, 3] } }

  var copy = clone(src)
  copy.a = 2
  copy.b.c = 'asdf'
  copy.b.d[1] = 4
  expect(src).toEqual(srcValues)
})

it('clones circular data', () => {
  var a: any = { foo: 'bar' }
  a.baz = a
  var b: any = { foo: 'bar' }
  b.baz = b
  expect(clone(a)).toEqual(b)
})

it('Clones Map', () => {
  const src = new Map([['foo', 'bar']])

  const copy = clone(src)

  copy.set('foo', 'baz')

  expect(src.get('foo')).toEqual('bar')
})

it('Clones Set', () => {
  const src = new Set(['foo', 'bar'])

  const copy = clone(src)

  copy.add('baz')

  expect(src.has('baz')).toBeFalsy()
})