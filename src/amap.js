import amapGeneric from "./util/amapGeneric";

/**
 * An asynchronous version of map over an iterable (amap stays for async-map).
 *
 * It gets an iterable of values (or promises) as input (or promise to resolve to iterable),
 * resolves them, maps over map function and returns a promise which resolves to an array of values.
 *
 * It allows asynchronous mapping point-free way and can be used with asynchronous compose functions.
 *
 * It uses Promise.all() under the hood.
 *
 * <pre><code>const [ first, second, third ] = await amap(getDataFromServer)([somePromise1, someValue2, somePromise3]);</code></pre>
 *
 * It first resolves a promises passed and then pass resolutions value to the mapping function.
 *
 * Input iterable's values are not restricted to promises but can be any value to pass as input to functions.
 *
 * It also allows to handle errors like for traditional Promise:
 *
 * <pre><code>amap(getDataFromServer)(somePromise1, someValue2, somePromise3).catch(e => console.error(e));</code></pre>
 *
 * @param {function} mapFn Is mapping function which can produce a promise (but not restricted to this).
 * Function can return a promise (asynchronous mapping) or may just perform some synchronous mapping.
 * So you can use it in synchronous code taking in mind it returns promise so can't be resolved immediately.
 * It has three parameters (currentValue, currentIndex, array) which are resolved (not promises).
 * @returns {(iterable : Promise|Iterable.<*>) => Promise} A function which expects any values as input (resolving to Promise)
 * and returns a Promise.
 */
export default amapGeneric();
