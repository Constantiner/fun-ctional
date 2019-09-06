import { extractArrayFromArgument } from "./extractArrayFromArgument";

const resolveArrayFromInput = async iterable => Promise.all(await extractArrayFromArgument(iterable));

const reducer = reduceFn => (acc, current, index, array) =>
	Promise.resolve(acc).then(acc => reduceFn(acc, current, index, array));

const getReducerArguments = (callback, initialValue) => {
	const effectiveReduceFn = reducer(callback);
	return initialValue === undefined ? [effectiveReduceFn] : [effectiveReduceFn, initialValue];
};

export { getReducerArguments, resolveArrayFromInput };
