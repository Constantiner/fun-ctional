import { extractArrayFromArgument } from "./extractArrayFromArgument";

const resolveArrayFromInput = async iterable => Promise.all(await extractArrayFromArgument(iterable));

const reducer = reduceFn => (accumulator, current, index, array) =>
	Promise.resolve(accumulator).then(accumulator => reduceFn(accumulator, current, index, array));

const getReducerArguments = (callback, initialValue) => {
	const effectiveReduceFn = reducer(callback);
	return initialValue === undefined ? [effectiveReduceFn] : [effectiveReduceFn, initialValue];
};

export { getReducerArguments, resolveArrayFromInput };
