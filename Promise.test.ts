import { assertEquals } from "https://deno.land/std@0.106.0/testing/asserts.ts";

import PromiseMonad from "./Promise.ts";

Deno.test("Promises have a unit operator", async () => {
  const monad = new PromiseMonad<number>();
  const result = monad.unit(15);
  const wrappedResult = await result;
  assertEquals(wrappedResult, 15);
});

Deno.test("Promises have a bind operator", async () => {
  const monad = new PromiseMonad<number>();
  const result = monad.bind<number, string>(monad.unit(10), (x) =>
    Promise.resolve<string>(x.toFixed(2))
  );
  const wrappedResult = await result;
  assertEquals(wrappedResult, "10.00");
});

/**
 * Todo: finalise behaviour of the Promise monad for `sappend` and `empty`.
 */
