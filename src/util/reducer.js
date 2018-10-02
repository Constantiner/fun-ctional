const reducer = reduceFn => (acc, current, index) =>
	Promise.resolve(acc).then(acc => Promise.resolve(current).then(current => reduceFn(acc, current, index)));

const getReducerArgs = args => {
	const effectiveReduceFn = reducer(args[0]);
	const effectiveArgs = Array.from(args);
	effectiveArgs[0] = effectiveReduceFn;
	return effectiveArgs;
};

export { getReducerArgs };
