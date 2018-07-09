const reducer = reduceFn => (acc, current, index) =>
	Promise.all([Promise.resolve(acc), Promise.resolve(current)]).then(([acc, current]) => reduceFn(acc, current, index));

const getReducerArgs = args => {
	const effectiveReduceFn = reducer(args[0]);
	const effectiveArgs = Array.from(args);
	effectiveArgs[0] = effectiveReduceFn;
	return effectiveArgs;
};

export { getReducerArgs };
