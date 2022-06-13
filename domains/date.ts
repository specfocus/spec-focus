// import DateFnsUtils from '@date-io/date-fns';
import {
  isFriday,
  isFuture,
  isMonday,
  isPast,
  isSaturday,
  isSunday,
  isTuesday,
  isWednesday,
  isWeekend
} from 'date-fns';
import { StringSchema } from '@specfocus/json-focus/StringSchema';
import { STRING_TYPE } from '@specfocus/json-focus/StringSchema';

interface DateDomain extends StringSchema {

}

export const DATE_ISO: DateDomain = {
  format: 'date',
  mask: 'yyyy-MM-dd',
  // dateFunsUtils: DateFnsUtils as any,
  label: 'Date',
  type: STRING_TYPE,
};

export const DATE_FORWARD: DateDomain = {
  ...DATE_ISO,
  shouldDisableDate: (date: Date) => !isPast(date),
};

export const DATE_BACKWARD: DateDomain = {
  ...DATE_ISO,
  shouldDisableDate: (date: Date) => !isFuture(date),
};

export const DATE_FRIDAY: DateDomain = {
  ...DATE_ISO,
  shouldDisableDate: (date: Date) => !isFriday(date),
  label: 'Friday'
};

export const DATE_MONDAY: DateDomain = {
  ...DATE_ISO,
  shouldDisableDate: (date: Date) => !isMonday(date),
  label: 'Monday'
};

export const DATE_SATURDAY: DateDomain = {
  ...DATE_ISO,
  shouldDisableDate: (date: Date) => !isSaturday(date),
  label: 'Saturday'
};

export const DATE_SUNDAY: DateDomain = {
  ...DATE_ISO,
  shouldDisableDate: (date: Date) => !isSunday(date),
  label: 'Sunday'
};

export const DATE_TUESDAY: DateDomain = {
  ...DATE_ISO,
  shouldDisableDate: (date: Date) => !isTuesday(date),
  label: 'Tuesday'
};

export const DATE_WEDNESDAY: DateDomain = {
  ...DATE_ISO,
  shouldDisableDate: (date: Date) => !isWednesday(date),
  label: 'Wednesday'
};

export const DATE_WEEKDAY: DateDomain = {
  ...DATE_ISO,
  shouldDisableDate: isWeekend,
  label: 'Weekday'
};

export const DATE_WEEKEND: DateDomain = {
  ...DATE_ISO,
  shouldDisableDate: (date: Date) => !isWeekend(date),
  label: 'Weekend'
};