import { Functor1 } from "./Functor.ts";
import { Monad } from "./Monad.ts";
import { Monoid } from "./Monoid.ts";
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
  map<B>(_f: (a: never) => B): Optional<B> {
    return this;
  }

  bind<B>(_f: (a: never) => Optional<B>): Optional<B> {
    return None;
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

  bind<B>(f: (a: T) => Optional<B>): Optional<B> {
    return f(this.value);
  }
}

export const None = new NoneType();
export type Optional<T> = Some<T> | NoneType;

class _OptionalFunctor implements Functor1<OptionalID> {
  fmap<A, B>(fa: Optional<A>, f: (a: A) => B): Optional<B> {
    return fa.map(f);
  }
}

export const OptionalFunctor = new _OptionalFunctor();

class _OptionalSemigroup<InnerType> implements Semigroup<Optional<InnerType>> {
  innerSemigroup: Semigroup<InnerType>;
  constructor(innerSemigroup: Semigroup<InnerType>) {
    this.innerSemigroup = innerSemigroup;
    this.sappend = this.sappend.bind(this);
  }
  sappend(
    one: Optional<InnerType>,
    two: Optional<InnerType>
  ): Optional<InnerType> {
    if (one.isSome() && two.isSome()) {
      return Some.of(this.innerSemigroup.sappend(one.value, two.value));
    }
    return None;
  }
}

export function OptionalSemigroup<InnerType>(
  semigroupForInnerType: Semigroup<InnerType>
) {
  const Semigroup: Semigroup<Optional<InnerType>> = new _OptionalSemigroup(
    semigroupForInnerType
  );
  return Semigroup;
}

export function OptionalMonoid<InnerType>(
  semigroupForInnerType: Semigroup<InnerType>
): Monoid<Optional<InnerType>> {
  return {
    ...OptionalSemigroup(semigroupForInnerType),
    empty: None,
  };
}

class _OptionalMonad<InnerType>
  extends _OptionalSemigroup<InnerType>
  // Todo: it'd be great for Monad to extend from Monoid, but currently they
  // use different sorts of types. Monoid doesn't need higher-kinded types,
  // so it just uses regular ones; whereas Monad *does* need higher-kinded
  // types and so uses the nasty string hack.
  implements Monad<OptionalID>, Monoid<Optional<InnerType>>
{
  empty = None;
  unit<T>(t: T): Optional<T> {
    return Some.of(t);
  }
  bind<A, B>(ma: Optional<A>, f: (input: A) => Optional<B>): Optional<B> {
    return ma.bind(f);
  }
}

export function OptionalMonad<InnerType>(
  semigroupForInnerType: Semigroup<InnerType>
) {
  return new _OptionalMonad<InnerType>(semigroupForInnerType);
}
