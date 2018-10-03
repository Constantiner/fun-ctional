/**
 * Composable version of catch method for promises.
 * 
 * It gets a value (a promise or not), resolves it and if resulting promise was rejected calls catch function.
 * 
 * It allows to handle errors within acompose or apipe asynchronous composition chains to restore broken state etc.
 * 
 * A sample with acompose:
 *
 * <pre><code>const resultOrFallback = await acompose(acatch(handleAndRecoverFn), canFailFn)(someInput);</code></pre>
 * 
 * Standalone usage:
 *
 * <pre><code>const resultOrFallback = await acatch(handleAndRecoverFn)(requestDataAndReturnPromise());</code></pre>
 * 
 * It is the same as the following:
 * 
 * <pre><code>requestDataAndReturnPromise().catch(handleAndRecoverFn).then(resultOrFallback => console.log(resultOrFallback));</code></pre>
 * 
 * @param {function} catchFn Is function to handle Promise's rejection.
 * @returns {any => Promise} A function which expects any value as input (Promise or not) and returns a Promise.
 */
export default catchFn => value => Promise.resolve(value).catch(catchFn);
