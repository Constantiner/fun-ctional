export interface MapCallback<T, U> {
	(value: T, index: number, array: T[]): U | Promise<U>;
};

export interface MapStrategy<T, U> {
	(mapFn: MapCallback<T, U>, array: T[]): Promise<U[]>;
};
