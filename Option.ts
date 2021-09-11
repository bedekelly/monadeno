import { Functor1 } from "./Functor.ts";
import { Semigroup } from "./Semigroup.ts";

const OptionalID = "Optional" as const;
type OptionalID = typeof OptionalID;

declare module "./HKT.ts" {
  interface NameToType<TypeParam1> {
    Optional: Optional<TypeParam1>;
  }
}

abstract class BaseOptional {
  _ID = OptionalID;
  isSome<T>(): this is Some<T> {
    return false;
  }
  isNone() {
    return !this.isSome();
  }
  static empty() {
    return None;
  }
}

class NoneType extends BaseOptional {
  _A!: never;
  map<B>(_: (a: never) => B): Optional<B> {
    return this;
  }
}

export class Some<T> extends BaseOptional {
  _A!: T;
  value: T;

  constructor(t: T) {
    super();
    this.value = t;
  }
  static of<T>(t: T) {
    const some = new Some<T>(t);
    return some;
  }

  isSome() {
    return true;
  }

  map<B>(f: (a: T) => B): Optional<B> {
    return Some.of(f(this.value));
  }
}

export const None = new NoneType();
export type Optional<T> = Some<T> | NoneType;

class _OptionalFunctor implements Functor1<OptionalID> {
  fmap<A, B>(fa: Optional<A>, f: (a: A) => B): Optional<B> {
    return fa.map(f);
  }
}

export function OptionalSemigroup<InnerType>(
  semigroupForInnerType: Semigroup<InnerType>
) {
  class _OptionalSemigroup implements Semigroup<Optional<InnerType>> {
    sappend(
      one: Optional<InnerType>,
      two: Optional<InnerType>
    ): Optional<InnerType> {
      if (one.isSome() && two.isSome()) {
        return Some.of(semigroupForInnerType.sappend(one.value, two.value));
      }
      return None;
    }
  }
  return new _OptionalSemigroup();
}

export const OptionalFunctor = new _OptionalFunctor();
