import { type PrimitiveValue, type JsonValue } from "@openfeature/web-sdk";

type EvaluationContextValue =
  | PrimitiveValue
  | Date
  | {
      [key: string]: EvaluationContextValue;
    }
  | EvaluationContextValue[];
type EvaluationContext = {
  targetingKey?: string;
} & Record<string, EvaluationContextValue>;
type Variants<T> = Record<string, T>;
export type Flag = {
  variants:
    | Variants<boolean>
    | Variants<string>
    | Variants<number>
    | Variants<JsonValue>;
  defaultVariant: string;
  state: string;
  contextEvaluator?: (ctx: EvaluationContext) => string;
};
