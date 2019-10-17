export interface ReducerCallback1<T> {
	(previousValue: T, currentValue: T, currentIndex: number, array: T[]): T | Promise<T>;
};
export interface ReducerCallback2<T, U> {
	(previousValue: U, currentValue: T, currentIndex: number, array: T[]): U | Promise<U>;
};

export interface Reducer1<T> {
	(callbackfn: (previousValue: Promise<T>, currentValue: Promise<T>, currentIndex: number, array: Promise<T>[]) => Promise<T>): Promise<T>;
}

export interface Reducer2<T, U> {
	(callbackfn: (previousValue: Promise<U>, currentValue: Promise<T>, currentIndex: number, array: Promise<T>[]) => Promise<U>, initialValue: Promise<U>): Promise<U>;
}

export type Reducer<T, U> = Reducer1<T> | Reducer2<T, U>;

export type ReducerCallback<T, U> = ReducerCallback1<T> | ReducerCallback2<T, U>;