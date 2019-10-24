/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { supportsCustomPromiseHandling, getCustomPromiseHandling } from "util/customPromiseHandlingSupport";

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
 * @param {...function} fns Are functions to pipe chains of promises.
 * @returns {(promise : Promise|any) => Promise} A function which expects any value as input (resolving to Promise) and returns a Promise.
 */
export default (...fns: Function[]) => async (promise: Promise<any>) =>
	fns.reduce((promise, fn) => {
		if (supportsCustomPromiseHandling(fn)) {
			return getCustomPromiseHandling(fn)(promise);
		}
		return promise.then(value => fn(value));
	}, Promise.resolve(promise));
