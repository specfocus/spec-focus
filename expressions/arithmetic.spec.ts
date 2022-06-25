import evaluate from './arithmetic';

describe('arithmetic', () => {
  it('should evaluate 2', () =>
    expect(
      evaluate('1 + 1')
    ).toBe(2)
  );
  it('should evaluate 256', () =>
    expect(
      evaluate('2^8')
    ).toBe(256)
  );
  it('should evaluate -30.5', () =>
    expect(
      evaluate('2 + 4*(30/5) - 34 + 45/2')
    ).toBe(-30.5)
  );
});