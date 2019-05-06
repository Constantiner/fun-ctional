import afilterGeneric from "./util/afilterGeneric";

/**
 * An asynchronous version of filter over an iterable (afilter stays for async-filter).
 *
 * It gets an iterable of values (or promises) as input (or promise to resolve to iterable),
 * resolves them, iterates over them with filter function
 * (which returns boolean where true means current value will be included in resulting array)
 * and returns a promise which resolves to an array of values (filtered input iterable).
 *
 * It allows asynchronous filtering point-free way and can be used with asynchronous compose functions.
 *
 * It uses Promise.all() under the hood.
 * So if filtering function is asynchronous (returns a promise) all promises are being generated at once
 * and then resolved with Promise.all().
 * So if any of promises will produce error (promise rejection) all the other promises will be invoked anyway.
 * The advantage of this method of invoking promises it will finish earlier than sequential filter (because of Promise.all())
 * but it may perform some fetches or even state modifications even in case of fail on some previous filtering steps.
 *
 * <pre><code>const [ first, third ] = await afilter(fetchPermissions)([somePromise1, someValue2, somePromise3]);</code></pre>
 *
 * It first resolves a promises passed and then pass resolutions value to the filtering function.
 *
 * Input iterable's values are not restricted to promises but can be any value to pass as input to functions.
 *
 * It also allows to handle errors like for traditional Promise:
 *
 * <pre><code>afilter(fetchPermissions)(somePromise1, someValue2, somePromise3).catch(e => console.error(e));</code></pre>
 *
 * @param {function} filterFn Is filtering function which can produce a promise (but not restricted to this).
 * Function can return a promise (asynchronous filtering) or may just perform some synchronous filtering.
 * So you can use it in synchronous code taking in mind it returns promise so can't be resolved immediately.
 * It has three parameters (currentValue, currentIndex, array) which are already resolved (not promises).
 * @returns {(iterable : Promise|Iterable.<*>) => Promise} A function which expects any values as input (resolving to Promise)
 * and returns a Promise.
 */
export default afilterGeneric();
