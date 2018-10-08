import extractArrayFromArgument from "./extractArrayFromArgument";

const resolveArrayFromInput = async iterable => Promise.all(await extractArrayFromArgument(iterable));

const reducer = reduceFn => (acc, current, index, array) =>
	Promise.resolve(acc).then(acc => reduceFn(acc, current, index, array));

const getReducerArgs = args => {
	const effectiveReduceFn = reducer(args[0]);
	const effectiveArgs = Array.from(args);
	effectiveArgs[0] = effectiveReduceFn;
	return effectiveArgs;
};

export { getReducerArgs, resolveArrayFromInput };
