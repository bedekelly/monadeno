import { MakeTypeWithOneParam, TypeWithOneParam } from "./HKT.ts";

export interface Semigroup0<F> {
  sappend(one: F, two: F): F;
}

export interface Semigroup1<S extends TypeWithOneParam, I> {
  sappend(
    one: MakeTypeWithOneParam<S, I>,
    two: MakeTypeWithOneParam<S, I>
  ): MakeTypeWithOneParam<S, I>;
}
