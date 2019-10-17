import { AsyncData, PromiseEnabledIterableOrArrayLike } from "./../types/iterables";
import { Reducer, Reducer1, Reducer2, ReducerCallback1, ReducerCallback2 } from "./../types/reduceTypes";
import { resolveIterablesToArray } from "./extractArrayFromArgument";

const isReducerCallback1 = <T, U>(
	callback: ReducerCallback1<T> | ReducerCallback2<T, U>,
	initialValue: U | Promise<U>
): callback is ReducerCallback1<T> => {
	if (initialValue === undefined) {
		return true;
	}
	return false;
};

const areduceGeneric = <T, U>(reduceFunc: Reducer<T, U>) => (
	callback: ReducerCallback1<T> | ReducerCallback2<T, U>,
	initialValue: U | Promise<U>
) => async (iterable: PromiseEnabledIterableOrArrayLike<T>): Promise<U | T> => {
	const resolvedArray: AsyncData<T>[] = await resolveIterablesToArray(iterable);
	const arrayOfPromises: Promise<T>[] = resolvedArray.map(value => Promise.resolve(value));
	const originalArray: T[] = await Promise.all(resolvedArray);
	if (isReducerCallback1(callback, initialValue)) {
		return (<Reducer1<T>>reduceFunc).call(
			arrayOfPromises,
			async (previousValue: Promise<T>, currentValue: Promise<T>, currentIndex: number): Promise<T> =>
				callback(await previousValue, await currentValue, currentIndex, originalArray)
		);
	}
	return (<Reducer2<T, U>>reduceFunc).call(
		arrayOfPromises,
		async (previousValue: Promise<U>, currentValue: Promise<T>, currentIndex: number): Promise<U> =>
			callback(await previousValue, await currentValue, currentIndex, originalArray),
		Promise.resolve(initialValue)
	);
};

export { areduceGeneric };
