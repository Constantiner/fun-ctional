export type AsyncData<T> = T | Promise<T>;

export type IterableOrArrayLike<T> = Iterable<AsyncData<T>> | ArrayLike<AsyncData<T>>;

export type PromiseEnabledIterableOrArrayLike<T> = Promise<IterableOrArrayLike<T>> | IterableOrArrayLike<T>;