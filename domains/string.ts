import { StringDomain } from '@specfocus/react-focus/lib/StringDomain';
import { STRING_TYPE } from '@specfocus/react-focus/lib/StringSchema';

export const DATE: StringDomain = {
  format: 'date',
  label: 'Date',
  type: STRING_TYPE,
};

export const DATE_TIME: StringDomain = {
  format: 'datetime',
  label: 'Date and Time',
  type: STRING_TYPE,
};

export const TEXT: StringDomain = {
  label: 'Text',
  type: STRING_TYPE,
};

export const EMAIL: StringDomain = {
  format: 'email',
  label: 'Email',
  type: STRING_TYPE,
};

export const GUID: StringDomain = {
  format: 'uuid',
  label: 'Guid',
  type: STRING_TYPE,
};

export const PHONE_NUMBER: StringDomain = {
  format: 'phone',
  label: 'Phone Number',
  type: STRING_TYPE,
};
