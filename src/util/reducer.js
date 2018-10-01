const reducer = reduceFn => async (acc, current, index) =>
	reduceFn(await Promise.resolve(acc), await Promise.resolve(current), index);

const getReducerArgs = args => {
	const effectiveReduceFn = reducer(args[0]);
	const effectiveArgs = Array.from(args);
	effectiveArgs[0] = effectiveReduceFn;
	return effectiveArgs;
};

export { getReducerArgs };
