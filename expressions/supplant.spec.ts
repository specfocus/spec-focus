import supplant, { lookup } from './supplant';

describe('supplant', () => {
  it('should', () =>
    expect(
      supplant(`I'm {age} years old!`, lookup({ age: 29 }))
    ).toBe(
      `I'm 29 years old!`
    )
  );
  it('should the cow say', () =>
    expect(
      supplant('The {a} says {n}, {n}, {n}!', lookup({ a: 'cow', n: 'moo' }))
    ).toBe('The cow says moo, moo, moo!')
  );
});