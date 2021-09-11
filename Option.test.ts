/**
 * Tests for the Option datatype.
 */
import {
  Some,
  None,
  Optional,
  OptionalFunctor,
  OptionalSemigroup,
  OptionalMonad,
} from "./Option.ts";
import { Semigroup } from "./Semigroup.ts";
import {
  assertEquals,
  assert,
} from "https://deno.land/std@0.106.0/testing/asserts.ts";

const some41 = Some.of(41);
const none = None;

Deno.test("Processing an Optional type works as expected", () => {
  function doStuff(x: Optional<number>) {
    return x.map((x) => x + 5).map((x) => x / 2);
  }

  const testOne = doStuff(some41);
  assertEquals(testOne.isSome() && testOne.value, 23);
  const testTwo = doStuff(none);
  assert(testTwo.isNone());
});

Deno.test("Can use explicit typeclass by importing OptionalFunctor", () => {
  // More explicit use of a given typeclass.
  const { fmap } = OptionalFunctor;
  const result = fmap(
    fmap(Some.of(3), (x) => x * 2),
    (x: number) => x * 2
  );
  assertEquals(result.isSome() && result.value, 12);
});

/**
 * Silly toy semigroup over numbers. Here, we're testing an "inner semigroup"
 * over a type of kind *, i.e. number.
 */
Deno.test("Can define and use a semigroup over Optional types", () => {
  const CombineNumbersFoolishly: Semigroup<number> = {
    sappend(one: number, two: number) {
      return one + two + 5;
    },
  };

  {
    const { sappend } = OptionalSemigroup(CombineNumbersFoolishly);
    const s = sappend(some41, some41);
    assertEquals(s.isSome() && s.value, 87);
  }
});

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
Deno.test("Can define semigroups over nested higher-order types", () => {
  const CombineOptionalBooleans: Semigroup<Optional<boolean>> = {
    sappend(one: Optional<boolean>, two: Optional<boolean>) {
      if (one.isSome() && two.isSome()) {
        return Some.of(one.value || two.value);
      }
      return None;
    },
  };

  {
    const { sappend } = OptionalSemigroup(CombineOptionalBooleans);
    const s = sappend(Some.of(Some.of(false)), Some.of(Some.of(true)));
    assert(s.isSome() && s.value.isSome() && s.value.value);
  }
});

/**
 * Optional Monad.
 */
const numbersUnderAddition: Semigroup<number> = {
  sappend(one: number, two: number) {
    return one + two;
  },
};

const optionalMonadWithAddition = OptionalMonad(numbersUnderAddition);

Deno.test("Monadic 'unit' should work for Optional", () => {
  const opt12 = optionalMonadWithAddition.unit(12);
  assertEquals(opt12.isSome() && opt12.value, 12);
});

Deno.test("Monadic 'bind' should work in the Some case", () => {
  const opt15 = optionalMonadWithAddition.unit(15);
  const opt25 = optionalMonadWithAddition.bind(opt15, (x) => Some.of(x + 10));
  assertEquals(opt25.isSome() && opt25.value, 25);
});

Deno.test("Monadic 'bind' should work in the None case", () => {
  // Test the monad's `bind` funciton in the None case.
  const optNone = optionalMonadWithAddition.empty;
  const optStillNone = optionalMonadWithAddition.bind(optNone, (x) =>
    Some.of(x + 20)
  );
  assert(optStillNone.isNone());
});

Deno.test(
  "Underlying Optional type should have chainable `bind` method which works in the Some case.",
  () => {
    // Test the underlying (and simpler) method of `bind`.
    const opt26 = Some.of(15).bind((x) => Some.of(x + 11));
    assertEquals(opt26.isSome() && opt26.value, 26);
  }
);

Deno.test(
  "Underlying Optional type should have `bind` method which works in the None case.",
  () => {
    const noneYetAgain = None.bind((x) => Some.of(x + 10));
    assert(noneYetAgain.isNone());
  }
);
