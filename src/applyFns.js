import { extractResolvedArguments } from "./util/extractResolvedArguments";

/**
 * A kind of composable version of Promise.all().
 *
 * It gets some value or promise as input, pass it to the functions list
 * and produces the array of results after resolving all the functions which can return promises as well.
 *
 * It allows to use Promise.all() point-free way.
 *
 * <pre><code>const [ first, second ] = await applyFns(squareRoot, getDataFromServer)(somePromise);</code></pre>
 *
 * It first resolves a promise passed and then pass resolution value to all the functions.
 *
 * Input value is not restricted to promise but can be any value to pass as input to functions.
 *
 * It also allows to handle errors like for traditional Promise:
 *
 * <pre><code>applyFns(squareRoot, getDataFromServer)(somePromise).catch(e => console.error(e));</code></pre>
 *
 * @param {...function|Iterable.<*>} fns Are functions to handle input value in parallel.
 * Functions can return promises or may just perform some mapping.
 * So you can use it in synchronous code taking in mind it returns promise so can't be resolved immediately.
 * @returns {(value : Promise|any) => Promise} A function which expects any value as input (resolving to Promise) and returns a Promise.
 */
export default (...fns) => async value => {
	const resolvedValue = await Promise.resolve(value);
	return Promise.all(extractResolvedArguments(fns).map(fn => fn(resolvedValue)));
};
