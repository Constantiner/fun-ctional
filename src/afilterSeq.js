import afilterGeneric from "./util/afilterGeneric";

/**
 * An asynchronous version of filter over an iterable (afilterSeq stays for async-filter).
 *
 * It gets an iterable of values (or promises) as input (or promise to resolve to iterable),
 * resolves them, iterates over them with filter function 
 * (which returns boolean where true means current value will be included in resulting array) 
 * and returns a promise which resolves to an array of values (filtered input iterable).
 *
 * It allows asynchronous filtering point-free way and can be used with asynchronous compose functions.
 *
 * The difference from regular afilter is if filter function is asynchronous (returns a promise) 
 * every new invocation of filter function performs sequentially after resolving previous promise.
 * So if any of promises produces error (promise rejection) afilterSeq will not produce new promises and they won't be invoked.
 *
 * <pre><code>const [ first, third ] = await afilterSeq(fetchPermissions)([somePromise1, someValue2, somePromise3]);</code></pre>
 *
 * It first resolves a promises passed and then pass resolutions value to the filtering function.
 *
 * Input iterable's values are not restricted to promises but can be any value to pass as input to functions.
 *
 * It also allows to handle errors like for traditional Promise:
 *
 * <pre><code>afilterSeq(fetchPermissions)(somePromise1, someValue2, somePromise3).catch(e => console.error(e));</code></pre>
 *
 * @param {function} filterFn Is filtering function which can produce a promise (but not restricted to this).
 * Function can return a promise (asynchronous filtering) or may just perform some synchronous filtering.
 * So you can use it in synchronous code taking in mind it returns promise so can't be resolved immediately.
 * It has three parameters (currentValue, currentIndex, array) which are already resolved (not promises).
 * @returns {(iterable : Promise|Iterable.<*>) => Promise} A function which expects any values as input (resolving to Promise)
 * and returns a Promise.
 */
export default afilterGeneric(true);
