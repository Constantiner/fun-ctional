export default (mapFn, catchFn) => value =>
	Promise.resolve(value)
		.then(mapFn)
		.catch(catchFn);
