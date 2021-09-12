import { Monad } from "./Monad.ts";

declare module "./HKT.ts" {
  interface NameToType<TypeParam1> {
    Promise: Promise<TypeParam1>;
  }
}

export default class PromiseMonad<T> implements Monad<"Promise", T> {
  unit(t: T) {
    return Promise.resolve(t);
  }
  bind<A, B>(ma: Promise<A>, f: (input: A) => Promise<B>): Promise<B> {
    return ma.then(f);
  }
  empty = Promise.resolve(null);
  sappend(one: Promise<T>, two: Promise<T>) {
    return Promise.all([one, two]);
  }
}
