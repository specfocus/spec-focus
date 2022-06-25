import type { SchemaLike } from '../schemas';

const isSchema = (obj: any): obj is SchemaLike => obj && obj.__isSchema__;

export default isSchema
