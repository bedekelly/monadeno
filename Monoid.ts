import { Semigroup } from "./Semigroup.ts";

export interface Monoid<T> extends Semigroup<T> {
  empty: T;
}
