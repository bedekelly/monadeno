/**
 * Tests for the Option datatype.
 */
import {
  Some,
  None,
  Optional,
  OptionalFunctor,
  OptionalSemigroup,
} from "./Option.ts";
import { Semigroup } from "./Semigroup.ts";

const some41 = Some.of(41);
const none = None;

function doStuff(x: Optional<number>) {
  x.map((x) => x + 5)
    .map((x) => x / 2)
    .map((x) => console.log(x));
}

doStuff(some41);
doStuff(none);

// More explicit use of a given typeclass.
const { fmap } = OptionalFunctor;
fmap(
  fmap(some41, (x) => x * 2),
  (result) => {
    console.log(result);
  }
);

/**
 * Tests for the Optional Semigroup.
 */

/**
 * Silly toy semigroup over numbers. Here, we're testing an "inner semigroup"
 * over a type of kind *, i.e. number.
 */
const SemigroupOnNumbers: Semigroup<number> = {
  sappend(one: number, two: number) {
    return one + two + 5;
  },
};

{
  const { sappend } = OptionalSemigroup<number>(SemigroupOnNumbers);
  const s = sappend(some41, some41);
  s.isSome() && console.log(s.value);
}

/**
 * Toy semigroup over optionals. The purpose of this is to test that HKTs can
 * be nested.
 * Here, we unpack two values of type Optional<Optional<boolean>>, then return a
 * single nested value of type Optional<Optional<boolean>>.
 *
 * This is extremely contrived, but e.g. a network response might be:
 * - None if there's no internet connection
 * - Some(None) if there was no response from the endpoint
 * - Some(Some(false)) if there was a response but it was an error
 * - Some(Some(true)) if there was a successful response.
 *
 * We define `AlternativeOptionalSemigroup` to check if either of two such
 * responses were successful.
 * (Later, we'll define `flat` to give us a more friendly API for this!)
 *
 * In short, we're testing an inner semigroup over a value of kind * -> *,
 * i.e. Optional<boolean>.
 *
 * This is... a bit handwavey. Ideally, we could define this without any reference to
 * the inner type, and *really* use an Optional type of kind * -> * instead of making
 * it concrete by passing `boolean`.
 * But TypeScript doesn't support higher-kinded types, so this causes an error.
 */
const AlternativeOptionalSemigroup: Semigroup<Optional<boolean>> = {
  sappend(one: Optional<boolean>, two: Optional<boolean>) {
    if (one.isSome() && two.isSome()) {
      return Some.of(one.value || two.value);
    }
    return None;
  },
};

{
  const { sappend } = OptionalSemigroup<Optional<boolean>>(
    AlternativeOptionalSemigroup
  );
  const s = sappend(Some.of(Some.of(false)), Some.of(Some.of(true)));
  console.log(s.isSome() && s.value.isSome() && s.value.value);
}
