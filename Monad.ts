import { TypeConstructor1, GetType1 } from "./HigherKindedTypes.ts";
import { Monoid } from "./Monoid.ts";

/**
 * Todo: Monad should extend Monoid!
 */
export interface Monad<M extends TypeConstructor1, T>
  extends Monoid<GetType1<M, T>> {
  unit(t: T): GetType1<M, T>;
  bind<A extends T, B>(
    ma: GetType1<M, A>,
    f: (input: A) => GetType1<M, B>
  ): GetType1<M, B>;
}
