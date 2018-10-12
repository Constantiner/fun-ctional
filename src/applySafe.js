import { addCustomPromiseHandlingSupport } from "./util/customPromiseHandlingSupport";

/**
 * Composable version of promise.then(mapFn).catch(catchFn).
 *
 * It gets a value (a promise or not), resolves it and handles as promise.then(mapFn).catch(catchFn) returning resulting promise.
 *
 * It allows to handle errors within acompose or apipe asynchronous composition chains to restore broken state etc.
 *
 * A sample with acompose:
 *
 * <pre><code>const resultOrFallback = await acompose(applySafe(canFailFn, handleAndRecoverFn), canFailTooFn)(someInput);</code></pre>
 *
 * Standalone usage:
 *
 * <pre><code>const resultOrFallback = await applySafe(canFailFn, handleAndRecoverFn)(requestDataAndReturnPromise());</code></pre>
 *
 * Or even:
 *
 * <pre><code>const resultOrFallback = await applySafe(acompose(handlerFn2, handlerFn1), handleAndRecoverFn)(requestDataAndReturnPromise());</code></pre>
 *
 * It is the same as the following:
 *
 * <pre><code>requestDataAndReturnPromise().then(canFailFn).catch(handleAndRecoverFn).then(resultOrFallback => console.log(resultOrFallback));</code></pre>
 *
 * @param {function} mapFn Is function to handle Promise's resolution (then).
 * @param {function} catchFn Is function to handle Promise's rejection (catch).
 * @returns {any => Promise} A function which expects any value as input (Promise or not) and returns a Promise.
 */
export default (mapFn, catchFn) => {
	const handler = value =>
		Promise.resolve(value)
			.then(mapFn)
			.catch(catchFn);
	return addCustomPromiseHandlingSupport(handler, promise => promise.then(mapFn).catch(catchFn));
};
