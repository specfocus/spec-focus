const {
  camelCase,
  pascalCase,
  snakeCase,
  sentenceCase,
  titleCase
} = require('./string');

describe('camelCase', () => {
  [
    ['hi  there', 'hiThere'],
    ['hi-there', 'hiThere'],
    ['hi_there_1', 'hiThere1'],
    ['  hi_there  ', 'hiThere'],
    ['1ApplePlease', '1ApplePlease'],
  ].forEach(([input, expected]) => {
    it(`should ${input} => ${expect}`, () => {
      expect(camelCase(input)).toBe(expected);
    });
  });
});

describe('pascalCase', () => {
  [
    ['hi  there', 'HiThere'],
    ['hi-there', 'HiThere'],
    ['hi_there_1', 'HiThere1'],
    ['  hi_there  ', 'HiThere'],
    ['1ApplePlease', '1ApplePlease'],
  ].forEach(([input, expected]) => {
    it(`should ${input} => ${expect}`, () => {
      expect(pascalCase(input)).toBe(expected);
    });
  });
});

describe('snakeCase', () => {
  [
    ['hi  there', 'hi_there'],
    ['hi-there', 'hi_there'],
    ['hi_there_1', 'hi_there_1'],
    ['  hi_there  ', 'hi_there'],
    ['1ApplePlease', '1_apple_please'],
  ].forEach(([input, expected]) => {
    it(`should ${input} => ${expect}`, () => {
      expect(snakeCase(input)).toBe(expected);
    });
  });
});

describe('sentenceCase', () => {
  ;[
    ['hi  there', 'Hi there'],
    ['hi-There', 'Hi there'],
    ['hi_there_1', 'Hi there 1'],
    ['  hi_there  ', 'Hi there'],
  ].forEach(([input, expected]) => {
    it(`should ${input} => ${expect}`, () => {
      expect(sentenceCase(input)).toBe(expected);
    });
  });
});

describe('titleCase', () => {
  [
    ['hi  there', 'Hi There'],
    ['hi-There', 'Hi There'],
    ['hi_there_1', 'Hi There 1'],
    ['  hi_there  ', 'Hi There'],
  ].forEach(([input, expected]) => {
    it(`should ${input} => ${expect}`, () => {
      expect(titleCase(input)).toBe(expected);
    });
  });
});