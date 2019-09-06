import { extractArrayFromArgument } from "./extractArrayFromArgument";

const filterMergeMap = filterFn => async (element, index, array) => {
	const filterResult = !!(await filterFn(element, index, array));
	return { filterResult, element };
};

const filterResultsReducer = (filteredArray, { filterResult, element }) => {
	if (filterResult) {
		return [...filteredArray, element];
	}
	return filteredArray;
};

const getFilteredInParallel = async (filterFn, array) => {
	const filterMergeMapFn = filterMergeMap(filterFn);
	const filterValues = await Promise.all(array.map(filterMergeMapFn));
	return filterValues.reduce(filterResultsReducer, []);
};

const getFilteredInSequence = async (filterFn, array) => {
	return array.reduce(
		(promise, element, index, originalArray) =>
			promise.then(async current => {
				const filterResult = !!(await filterFn(element, index, originalArray));
				if (filterResult) {
					return [...current, element];
				}
				return current;
			}),
		Promise.resolve([])
	);
};

const afilterGeneric = filterImpl => filterFn => async iterable => {
	const sourceArray = await extractArrayFromArgument(iterable);
	const array = await Promise.all(sourceArray);
	return filterImpl(filterFn, array);
};

export { afilterGeneric, getFilteredInParallel, getFilteredInSequence };
