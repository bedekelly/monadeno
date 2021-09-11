// We have to use `any` here, since the correct definition would be a HKT itself.
// Disable empty-interface linting, since we do add members to this interface later.
// https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation
// deno-lint-ignore no-empty-interface,no-explicit-any
export interface NameToType<TypeParam1> extends Record<string, any> {}

export interface TypesWithOneParam<TypeConstructor, TypeParam1> {
  _TypeConstructor: TypeConstructor;
  _TypeParam1: TypeParam1;
}
export type TypeWithOneParam = keyof NameToType<unknown>;

export type MakeTypeWithOneParam<
  TypeConstructor extends TypeWithOneParam,
  TypeParam1
> = NameToType<TypeParam1>[TypeConstructor];
