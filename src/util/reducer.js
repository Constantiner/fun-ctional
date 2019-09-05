import { extractArrayFromArgument } from "./extractArrayFromArgument";

const resolveArrayFromInput = async iterable => Promise.all(await extractArrayFromArgument(iterable));

const reducer = reduceFn => (acc, current, index, array) =>
	Promise.resolve(acc).then(acc => reduceFn(acc, current, index, array));

const getReducerArguments = args => {
	const effectiveReduceFn = reducer(args[0]);
	const effectiveArguments = [...args];
	effectiveArguments[0] = effectiveReduceFn;
	return effectiveArguments;
};

export { getReducerArguments, resolveArrayFromInput };
