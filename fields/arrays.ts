import { FieldArrayPath, FieldArrayPathValue } from './paths';
import { FieldValues } from './values';

/**
 * `useFieldArray` returned `fields` with unique id
 */
 export type FieldArrayWithId<
 TFieldValues extends FieldValues = FieldValues,
 TFieldArrayName extends FieldArrayPath<TFieldValues> = FieldArrayPath<TFieldValues>,
 TKeyName extends string = 'id',
> = FieldArray<TFieldValues, TFieldArrayName> & Record<TKeyName, string>;

export type FieldArray<
 TFieldValues extends FieldValues = FieldValues,
 TFieldArrayName extends FieldArrayPath<TFieldValues> = FieldArrayPath<TFieldValues>,
> = FieldArrayPathValue<TFieldValues, TFieldArrayName> extends
 | ReadonlyArray<infer U>
 | null
 | undefined
 ? U
 : never;