import { FilterFn, FilterStrategy } from "./../types/filterTypes";
import { PromiseEnabledIterableOrArrayLike } from "./../types/iterables";
import { extractArrayFromArgument } from "./extractArrayFromArgument";

interface CombinedFilterResultWithElement<T> {
	filterResult: boolean;
	element: T;
}

const getCombineFilterResultsWithElementsFn = <T>(filterFn: FilterFn<T>) => async (
	element: T,
	index: number,
	array: T[]
): Promise<CombinedFilterResultWithElement<T>> => {
	const filterResult = !!(await filterFn(element, index, array));
	return { filterResult, element };
};

const getFilteredInParallel = async <T>(filterFn: FilterFn<T>, array: Array<T>): Promise<Array<T>> => {
	const combineFilterResultsWithElements = getCombineFilterResultsWithElementsFn(filterFn);
	const filterResultsWithOriginalElements = await Promise.all(array.map(combineFilterResultsWithElements));
	return filterResultsWithOriginalElements.filter(({ filterResult }) => filterResult).map(({ element }) => element);
};

const getAsynchronousFilterReducer = <T>(filterFn: FilterFn<T>) => (
	promise: Promise<T[]>,
	element: T,
	index: number,
	originalArray: T[]
): Promise<T[]> =>
	promise.then(async (current: T[]) => {
		const filterResult = await filterFn(element, index, originalArray);
		if (filterResult) {
			return [...current, element];
		}
		return current;
	});

const getFilteredInSequence = <T>(filterFn: FilterFn<T>, array: Array<T>): Promise<Array<T>> => {
	const asynchronousFilterReducer = getAsynchronousFilterReducer(filterFn);
	return array.reduce(asynchronousFilterReducer, Promise.resolve([]));
};

const afilterGeneric = <T>(filterImpl: FilterStrategy<T>) => (filterFn: FilterFn<T>) => async (
	iterable: PromiseEnabledIterableOrArrayLike<T>
): Promise<T[]> => {
	const sourceArray = await extractArrayFromArgument(iterable);
	const array = await Promise.all(sourceArray);
	return filterImpl(filterFn, array);
};

export { afilterGeneric, getFilteredInParallel, getFilteredInSequence };
