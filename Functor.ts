import { TypeConstructor1, GetType1 } from "./HigherKindedTypes.ts";

export interface Functor1<F extends TypeConstructor1> {
  fmap: <A, B>(fa: GetType1<F, A>, f: (a: A) => B) => GetType1<F, B>;
}
