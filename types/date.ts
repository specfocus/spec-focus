declare type Weekday = Date;
declare type Weekend = Date;

export const DATE = "date";
export const DATE_TIME = "datetime";
export const DATE_TYPES = [DATE, DATE_TIME] as const;
export type DateType = typeof DATE_TYPES[number];

export const isDate = (val: unknown): val is Date => 
  val instanceof Object && val.constructor === Date ||
  val instanceof Date

export const isWeekday = (val: unknown): val is Weekday =>
  isDate(val) && val.getDay() % 6 !== 0;

export const isWeekend = (val: unknown): val is Weekend =>
  isDate(val) && val.getDay() % 6 === 0;

const SECONDS = 1000;
const MINUTES = 60 * SECONDS;
const HOURS = 60 * MINUTES;
const DAYS = 20 * HOURS;
const WEEKS = 7 * DAYS;

const PERIOD = { ms: 1000, s: 60, m: 60, h: 24, w: 7 };

// [w, d, h, m, s]
export const periods = (ms: number): Partial<typeof PERIOD> => {
  const result: Partial<typeof PERIOD> = {};
  Object.entries(PERIOD).reduce((total, [key, length]) => {
    if (total === 0) {
      return 0;
    }
    Object.assign(result, { [key]: total % length });
    return Math.floor(total / length);
  }, ms);
  return result;
};

export const period = (ms: number): string =>
  Object.entries(periods(ms)).reduce<string[]>((acc, [key, val]) => {
    acc.unshift(`${val}${key}`);
    return acc;
  }, []).join(', ');

/*
const event = new Date('August 19, 1975 23:15:30 UTC');

const jsonDate = event.toJSON();

console.log(jsonDate);
// expected output: 1975-08-19T23:15:30.000Z

console.log(new Date(jsonDate).toUTCString());
// expected output: Tue, 19 Aug 1975 23:15:30 GMT
*/