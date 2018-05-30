const acompose = (...fns) => async promise =>
	fns.reduceRight((promise, fn) => promise.then(fn), Promise.resolve(promise));

export { acompose };
