import extractResolvedArguments from "./util/extractResolvedArguments";

/**
 * Asynchronous pipe function (apipe stays for async-pipe).
 *
 * The main purpose is to replace a Promise handling code like this:
 * <pre><code>somePromise.then(normalize).then(upperCase).then(insertGreetings);</code></pre>
 *
 * with point-free style of functional pipe syntax like the following:
 * <pre><code>apipe(normalize, upperCase, insertGreetings)(somePromise);</code></pre>
 *
 * It is lazy and allows of reusing of promise handling chains.
 *
 * You can run apipe with Promise instance (for true asynchronous execution)
 * or with any other object to use as in usual functional composition.
 * It produces a Promise and can be used in async/await context:
 *
 * <pre><code>const message = await apipe(normalize, upperCase, insertGreetings)(somePromise);</code></pre>
 *
 * It also allows to handle errors like for traditional Promise but only in the tail position of the chain:
 *
 * <pre><code>apipe(normalize, upperCase, insertGreetings)(somePromise).catch(e => console.error(e));</code></pre>
 *
 * @param {...function|Iterable.<*>} fns Are functions to pipe chains of promises.
 * @returns {(promise : Promise|any) => Promise} A function which expects any value as input (resolving to Promise) and returns a Promise.
 */
export default (...fns) => async promise =>
	extractResolvedArguments(fns).reduce((promise, fn) => promise.then(fn), Promise.resolve(promise));
