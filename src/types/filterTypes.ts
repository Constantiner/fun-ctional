export type FilterFn<T> = (value: T, index: number, array: T[]) => unknown | Promise<unknown>;

export type FilterStrategy<T> = (filterFn:FilterFn<T>, array:Array<T>) => Promise<Array<T>>;