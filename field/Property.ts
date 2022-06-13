import { SimpleType } from '../../object';
import { PropertiesSchema } from '../../json/schema/ObjectJsonSchema';

export class Property {
  constructor(public schema?: PropertiesSchema<SimpleType>) {
  }
}