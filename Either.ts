// class BaseEither {
//   _isRight: false;
// }

// class Left<T> extends BaseEither {
//   value: T;
//   constructor(val: T) {
//     super();
//     this.value = val;
//     this.isLeft = true;
//   }
// }

// class Right<U> extends BaseEither {
//   value: U;
//   constructor(val: U) {
//     super();
//     this.value = val;
//     this.isLeft = false;
//   }
// }

// type Either<T, U> = Left<T> | Right<U>;
