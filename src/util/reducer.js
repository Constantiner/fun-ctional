const reducer = reduceFn => (acc, current, index, array) =>
	Promise.all([acc, current]).then(([acc, current]) => reduceFn(acc, current, index, array));

const getReducerArgs = args => {
	const effectiveReduceFn = reducer(args[0]);
	const effectiveArgs = Array.from(args);
	effectiveArgs[0] = effectiveReduceFn;
	return effectiveArgs;
};

export { getReducerArgs };
