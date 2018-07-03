import extractArguments from "./util/extractArguments";

/**
 * Composable version of Promise.all() or asynchronous map over iterable.
 * 
 * It gets an iterable of values or promises as input, resolves them, maps over map function 
 * and returns a promise which resolves to an array of values.
 * 
 * It allows asynchronous mapping point-free way and can be used with asynchronous compose functions.
 * 
 * It uses Promise.all() under the hood.
 *
 * <pre><code>const [ first, second, third ] = await allFromList(getDataFromServer)([somePromise1, someValue2, somePromise3]);</code></pre>
 * 
 * It first resolves a promises passed and then pass resolutions value to the mapping function.
 * 
 * Input values is not restricted to promises but can be any value to pass as input to functions.
 *
 * It also allows to handle errors like for traditional Promise:
 *
 * <pre><code>allFromList(getDataFromServer)(somePromise1, someValue2, somePromise3).catch(e => console.error(e));</code></pre>
 *
 * @param {function} fn Is mapping function which can produce a promise (but not restricted in this).
 * Function can return promises or may just performs some mapping. 
 * So you can use it in synchronous code taking in mind it returns promise so can't be resolved immediately.
 * @returns {(promise : ...Promise|...any|Iterable.<*>) => Promise} A function which expects any values as input (resolving to Promise) 
 * and returns a Promise.
 */
export default fn => async (...values) =>
	Promise.all(
		extractArguments(values.length === 1 ? await Promise.resolve(values) : values).map(val =>
			Promise.resolve(val).then(fn)
		)
	);
