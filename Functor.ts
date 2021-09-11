import { TypeWithOneParam, MakeTypeWithOneParam } from "./HKT.ts";

export interface Functor1<F extends TypeWithOneParam> {
  fmap: <A, B>(
    fa: MakeTypeWithOneParam<F, A>,
    f: (a: A) => B
  ) => MakeTypeWithOneParam<F, B>;
}
