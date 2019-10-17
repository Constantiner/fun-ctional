import { PromiseEnabledIterableOrArrayLike } from "./../types/iterables";
import { MapCallback, MapStrategy } from "./../types/mapTypes";
import { extractArrayFromArgument } from "./extractArrayFromArgument";

const getMappedInParallel = <T, U>(mapFn: MapCallback<T, U>, array: T[]): Promise<U[]> => Promise.all(array.map(mapFn));

const getMappedInSequence = async <T, U>(mapFn: MapCallback<T, U>, array: T[]): Promise<U[]> =>
	array.reduce(
		(promise: Promise<U[]>, element: T, index: number, originalArray: T[]) =>
			promise.then(async current => [...current, await mapFn(element, index, originalArray)]),
		Promise.resolve([])
	);

const amapGeneric = <T, U>(mapImpl: MapStrategy<T, U>) => (mapFn: MapCallback<T, U>) => async (
	iterable: PromiseEnabledIterableOrArrayLike<T>
): Promise<U[]> => {
	const sourceArray = await extractArrayFromArgument(iterable);
	const array = await Promise.all(sourceArray);
	return mapImpl(mapFn, array);
};

export { amapGeneric, getMappedInParallel, getMappedInSequence };
