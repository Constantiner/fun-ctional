/**
 * Asynchronous compose function (acompose stays for async-compose).
 *
 * The main purpose is to replace a Promise handling code like this:
 * <pre><code>somePromise.then(normalize).then(upperCase).then(insertGreetings);</code></pre>
 *
 * with point-free style of functional compose syntax like the following:
 * <pre><code>acompose(insertGreetings, upperCase, normalize)(somePromise);</code></pre>
 *
 * It is lazy and allows of reusing of promise handling chains.
 *
 * You can run acompose with Promise instance (for true asynchronous execution)
 * or with any other object to use as usual functional composition.
 * It produces a Promise and can be used in async/await context:
 *
 * <pre><code>const message = await acompose(insertGreetings, upperCase, normalize)(somePromise);</code></pre>
 *
 * It also allows to handle errors like for traditional Promise but only in the tail position of the chain:
 *
 * <pre><code>acompose(insertGreetings, upperCase, normalize)(somePromise).catch(e => console.error(e));</code></pre>
 *
 * @param {function} fns Are functions to compose chains of promises.
 * @param {Promise} promise Is original promise (or anything else) as input value.
 * @returns A resulting Promise.
 */
const acompose = (...fns) => async promise =>
	fns.reduceRight((promise, fn) => promise.then(fn), Promise.resolve(promise));

export { acompose };
