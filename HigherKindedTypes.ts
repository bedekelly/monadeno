// We have to use `any` here, since the correct definition would be a HKT itself.
// Disable empty-interface linting, since we do add members to this interface later.
// https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation
// deno-lint-ignore no-empty-interface,no-explicit-any
export interface NameToType<TypeParam1> extends Record<string, any> {}

/**
 * Store the "monadic" (as in, types of kind * -> *) types as two
 * parts: the constructor and the first type parameter.
 * This is good for things like Optional, Future, etc. which have
 * a single type parameter.
 * Later, for things like Either, we'll add a similar interface for
 * types of kind * -> * -> * and beyond.
 */
export interface HigherOrderType1<TypeConstructor, TypeParam1> {
  _TypeConstructor: TypeConstructor;
  _TypeParam1: TypeParam1;
}

/**
 * TypeConstructor1 refers to the "Option" part of Option<boolean>.
 * More generally, it's any type constructor with an arity of 1.
 */
export type TypeConstructor1 = keyof NameToType<unknown> & string;

/**
 * MakeType1 is a utility type which takes two parameters: the constructor
 * (e.g. Option) and the first type parameter (e.g. boolean).
 * It would be super-simple without the generic: just take the string name,
 * and look up the higher-kinded type. "Optional" maps to Optional. Boom, job
 * done.
 *
 * Unfortunately, we can't just reference `Optional` without providing
 * a type parameter in TS! So to get around this, we parameterise the
 * `NameToType` map with a `TypeParam1` argument. Each type like Optional
 * can populate this map with a record like { "Optional": Optional<T> },
 * since T is available to use... generic interfaces like this are witchcraft
 * in my book.
 *
 * When `MakeType1` is called, we provide the real first type parameter (e.g.
 * boolean, in the case of Optional<boolean>).
 * This means that we'll pass it into `T` in the generic interface, and get
 * a concrete type of `Optional<boolean>` to return to the user.
 *
 * Why is all of this necessary again? Well, because typescript doesn't allow
 * us to define higher-kinded types. In practice, this means we can't (for example)
 * define something like a Functor.
 *
 * To define a functor, we need to reference some type F, which we'd like to provide
 * a `fmap` function over.
 *
 * interface Functor<F> {
 *   fmap<A, B>(fa: F<A>, f: (a: A) => B): F<B>;
 * }
 *
 * Unfortunately, this doesn't compile — it marks our first `F<A>` as an error,
 * saying "F is not generic". And there's no way to express it right now.
 *
 * In an ideal world, we could say something like:
 *
 * interface Functor<F<*>>, or Functor<F<~>>, or even Functor<F: (* -> *)>
 *
 * But currently it's not possible, so we mock it with these steps:
 * 1. Make a generic type-level interface, which acts as a map from unique ID strings
 *    to types instantiated with some generic type parameter.
 * 2. Create a utility function which takes an ID string and a type parameter,
 *    populates the interface with the type parameter, and retrieves a populated
 *    concrete type.
 */
export type GetType1<
  TypeConstructor extends TypeConstructor1,
  TypeParam1
> = NameToType<TypeParam1>[TypeConstructor];
