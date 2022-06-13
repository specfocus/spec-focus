import { SimpleObject } from "./object";

type Bit = 0 | 1;

type ProjectObj<T, K> = K extends string
  ? Record<string, Bit> // Project<T>
  : T extends (infer U)[]
  ? Bit // ProjectItem<U>
  : Bit;

  type ProjectArr<U> = U extends boolean | number | string
  ? Bit
  : Record<string, Bit>;

  type ProjectObj2<T, K> = T extends (infer U)[] ? ProjectArr<U> : Record<string, Bit>;

type ProjectType<T> = T extends boolean | number | string
  ? Bit
  : ProjectObj2<T, keyof T>;

export type Project<T extends {}> = {
  [K in keyof T]: ProjectType<T[K]>;
};
