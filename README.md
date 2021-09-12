# FP-TS-inspired implementation of some common typeclasses in Deno/TS.

## Implementation Notes

This implementation is heavily based on the [fp-ts technical overview](https://gist.github.com/gcanti/2b455c5008c2e1674ab3e8d5790cdad5),
fixing various problems that arose using Deno and strict tsconfig options.

1. More descriptive names are used in the implementation of higher-kinded types with a lookup table.
2. Type predicates added as methods to the `Option` type to allow narrowing with (o.isSome() && ...).
3. TypeNameToType (originally "URI2HKT" in the fp-ts technical overview) must extend a generic record type to avoid errors with lookups.
4. Deno imports must have the `.ts` suffix.
5. TypeNameToType causes a linting error for an empty interface, but this ignores the possibility of [declaration-merging/module augmentation](https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation).

## Running Tests
Run `deno test` in the directory; each file ending in `*.test.ts` will be automatically found and executed.
```
$ deno test
running 9 tests from file:///Users/bede/Code/monadeno/Option.test.ts
test Processing an Optional type works as expected ... ok (8ms)
test Can use explicit typeclass by importing OptionalFunctor ... ok (8ms)
test Can define and use a semigroup over Optional types ... ok (7ms)
test Can define semigroups over nested higher-order types ... ok (7ms)
test Monadic 'unit' should work for Optional ... ok (8ms)
test Monadic 'bind' should work in the Some case ... ok (8ms)
test Monadic 'bind' should work in the None case ... ok (7ms)
test Underlying Optional type should have chainable `bind` method which works in the Some case. ... ok (8ms)
test Underlying Optional type should have `bind` method which works in the None case. ... ok (7ms)

test result: ok. 9 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out (108ms)
```
