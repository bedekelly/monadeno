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
import { Semigroup0 } from "./Semigroup.ts";

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
 * Silly toy semigroup over numbers.
 */
const SemigroupOnNumbers: Semigroup0<number> = {
  sappend<A, B, C>(one: number, two: number) {
    return one + two + 5;
  },
};

const { sappend } = OptionalSemigroup(SemigroupOnNumbers);
const s = sappend(some41, some41);
s.isSome() && console.log(s.value);
