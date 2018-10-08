import extractArrayFromArgument from "./extractArrayFromArgument";

const filterMergeMap = filterFn => async (element, index, array) => {
	const filterResult = !!(await filterFn(element, index, array));
	return { filterResult, element };
};

const filterResultsReducer = (filteredArray, { filterResult, element }) => {
	if (filterResult) {
		filteredArray.push(element);
	}
	return filteredArray;
};

const getFilteredInParallel = async (filterFn, array) => {
	const filterMergeMapFn = filterMergeMap(filterFn);
	const filterValues = await Promise.all(array.map(filterMergeMapFn));
	return filterValues.reduce(filterResultsReducer, []);
};

const getFilteredInSequence = async (filterFn, array) => {
	const result = [];
	for (let i = 0; i < array.length; i++) {
		const filterResult = !!(await filterFn(array[i], i, array));
		if (filterResult) {
			result.push(array[i]);
		}
	}
	return result;
};

export default (sequence = false) => filterFn => async iterable => {
	const sourceArray = await extractArrayFromArgument(iterable);
	const array = await Promise.all(sourceArray);
	return sequence ? await getFilteredInSequence(filterFn, array) : await getFilteredInParallel(filterFn, array);
};
