import { Model } from "./model";

export const $abs = "$abs";
export const $add = "$add";
export const $acos = "$acos";
export const $acosh = "$acosh";
export const $asin = "$asin";
export const $asinh = "$asinh";
export const $atan = "$atan";
export const $atan2 = "$atan2";
export const $atanh = "$atanh";
export const $cbrt = "$cbrt";
export const $ceil = "$ceil";
export const $clz32 = "$clz32";
export const $cos = "$cos";
export const $divide = "$divide";
export const $floor = "$floor";
export const $fround = "$fround";
export const $hypot = "$hypot";
export const $imul = "$imul";
export const $log = "$log";
export const $log10 = "$log10";
export const $log1p = "$log1p";
export const $log2 = "$log2";
export const $max = "$max";
export const $min = "$min";
export const $multiply = "$multiply";
export const $pi = "$pi";
export const $pow = "$pow";
export const $random = "$random";
export const $round = "$round";
export const $sign = "$sign";
export const $sin = "$sin";
export const $sinh = "sinh";
export const $sqrt = "sqrt";
export const $subtract = "$subtract";
export const $tan = "$tan";
export const $tanh = "$tanh";
export const $trunc = "$trunc";

const NUMERIC_VALUES = [$pi, $random] as const;
const BINARY_OPERATORS = [$divide, $imul, $pow, $subtract] as const;
const RANGE_OPERATORS = [$add, $hypot, $max, $min, $multiply] as const;
const UNARY_OPERATORS = [
  $abs,
  $acos,
  $acosh,
  $asin,
  $asinh,
  $atan,
  $atan2,
  $atanh,
  $cbrt,
  $ceil,
  $clz32,
  $cos,
  $floor,
  $fround,
  $log,
  $log10,
  $log1p,
  $log2,
  $round,
  $sign,
  $sin,
  $sinh,
  $sqrt,
  $tan,
  $tanh,
  $trunc,
] as const;

export type NumericValue = typeof NUMERIC_VALUES[number];
export type BinaryOperator = typeof BINARY_OPERATORS[number];
export type RangeOperator = typeof RANGE_OPERATORS[number];
export type UnaryOperator = typeof UNARY_OPERATORS[number];

type Numeric<T extends {}, K extends keyof T> =
  | number
  | K
  | NumericValue
  | Operation<T>;

export type BinaryOperation<T extends {}, K extends keyof T> = [
  BinaryOperator,
  Numeric<T, K>,
  Numeric<T, K>
];

export type RangeOperation<T extends {}, K extends keyof T> = [
  RangeOperator,
  ...Numeric<T, K>[]
];

export type UnaryOperation<T extends {}, K extends keyof T> = [
  UnaryOperator,
  Numeric<T, K>
];

type Operation<T extends {}> =
  | BinaryOperation<T, keyof T>
  | RangeOperation<T, keyof T>
  | UnaryOperation<T, keyof T>;

export type Compute<T extends {}> = {
  [key: string]: Operation<T>;
};

export function compute<T>(
  s: T,
  c: Compute<T>,
  model: Model<T>
): Record<string, number> {
  throw new Error("");
}

interface V {
  a: number;
  b: number;
  c: number;
  d: string;
}

const v: Compute<V> = {
  add: [$add, "a", "b", "c", "d"],
  divide: [$divide, "a", [$subtract, $pi, $random]],
};

compute<V>(
  {
    a: 5,
    b: 7,
    c: 8,
    d: "9",
  },
  v,
  {
    area: "",
    name: "v",
    hint: "",
    fields: {
      a: { type: "number" },
      b: { type: "number" },
      c: { type: "number" },
      d: { type: "string" },
    }
  }
);
