import { TypeConstructor1, GetType1 } from "./HigherKindedTypes.ts";
import { Monoid } from "./Monoid.ts";

/**
 * Todo: Monad should extend Monoid!
 */
export interface Monad<M extends TypeConstructor1> {
  unit<T>(t: T): GetType1<M, T>;
  bind<A, B>(
    ma: GetType1<M, A>,
    f: (input: A) => GetType1<M, B>
  ): GetType1<M, B>;
}
