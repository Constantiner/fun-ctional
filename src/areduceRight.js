import { getReducerArguments, resolveArrayFromInput } from "./util/reducer";

/**
 * Asynchronous composable version of reduceRight method for iterables ("a" stays for "asynchronous").
 *
 * It gets a list of values (or list of promises, or promise to resolve to list) and performs standard reduce on them.
 *
 * Reduce function may be asynchronous to return a promise (to fetch some data etc).
 *
 * Initial value of reducer also could be a promise.
 *
 * A sample usage is:
 *
 * <pre><code>const sum = async (currentSum, invoiceId) => {
 * 		const { total:invoiceTotal } = await fetchInvoiceById(invoiceId);
 * 		return currentSum + invoiceTotal;
 * };
 * const paymentTotal = await areduceRight(sum, 0)(fetchInvoiceIds(userId));</code></pre>
 *
 * Or the same with acompose:
 *
 * <pre><code>const paymentTotal = await acompose(areduceRight(sum, 0), fetchInvoiceIds)(userId);</code></pre>
 *
 * @param {function} callback Function to execute on each element in the array, taking four arguments
 * (accumulator, currentValue, currentIndex, array).
 * @param {any?} initialValue (optional) Value to use as the first argument to the first call of the callback.
 * @returns {(iterable : Promise|Iterable.<*>) => Promise} A function which expects an iterable
 * (or promise resolved to iterable) and returns a Promise.
 */
export default (callback, initialValue) => async iterable =>
	Array.prototype.reduceRight.apply(
		await resolveArrayFromInput(iterable),
		getReducerArguments(callback, initialValue)
	);
