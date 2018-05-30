const acompose = (...fns) => async promise =>
	fns.reduceRight((promise, fn) => promise.then(fn), Promise.resolve(promise));

const apipe = (...fns) => async promise => fns.reduce((promise, fn) => promise.then(fn), Promise.resolve(promise));

export { acompose, apipe };
