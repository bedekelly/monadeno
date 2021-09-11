export interface Semigroup<F> {
  sappend(one: F, two: F): F;
}
