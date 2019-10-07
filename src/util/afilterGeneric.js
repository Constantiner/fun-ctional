import { extractArrayFromArgument } from "./extractArrayFromArgument";

const getCombineFilterResultsWithElementsFn = filterFn => async (element, index, array) => {
	const filterResult = !!(await filterFn(element, index, array));
	return { filterResult, element };
};

const getFilteredInParallel = async (filterFn, array) => {
	const combineFilterResultsWithElements = getCombineFilterResultsWithElementsFn(filterFn);
	const filterResultsWithOriginalElements = await Promise.all(array.map(combineFilterResultsWithElements));
	return filterResultsWithOriginalElements.filter(({ filterResult }) => filterResult).map(({ element }) => element);
};

const getFilteredInSequence = async (filterFn, array) =>
	array.reduce(
		async (promise, element, index, originalArray) =>
			promise.then(async current => {
				const filterResult = !!(await filterFn(element, index, originalArray));
				if (filterResult) {
					return [...current, element];
				}
				return current;
			}),
		Promise.resolve([])
	);

const afilterGeneric = filterImpl => filterFn => async iterable => {
	const sourceArray = await extractArrayFromArgument(iterable);
	const array = await Promise.all(sourceArray);
	return filterImpl(filterFn, array);
};

export { afilterGeneric, getFilteredInParallel, getFilteredInSequence };
