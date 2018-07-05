import isIterable from "./isIterable";

/**
 * Returns an array of values from arguments of some function.
 * Arguments can be passed as arguments list ar as single iterable parameter.
 *
 * @param {array} args are input array (just arguments of some other function).
 * If if consists of one element and this element is an iterable returns array from it.
 * @returns {Promise} Resulting array of arguments.
 */
const extractResolvedArguments = args =>
	args ? (args.length === 1 && isIterable(args[0]) ? Array.from(args[0]) : args) : [];

/**
 * Returns a promise which resolved to array of values from arguments of some function.
 * Arguments can be passed as arguments list or as single iterable parameter.
 *
 * @param {array} vals are input array (just arguments of some other function).
 * If if consists of one element and this element is an iterable returns array from it.
 * It can be an array of single promise to resolve to an array or iterable.
 * @returns {Promise} A promise to resolve to resulting array of arguments.
 */
const extractArguments = async vals =>
	extractResolvedArguments(vals.length === 1 ? [await Promise.resolve(vals[0])] : vals);

/**
 * Returns a promise which resolved to array of values from a passed iterable.
 * An iterable can be a promise to resolve to iterable and then to array.
 *
 * @param {Promise|Iterable.<*>} arg Is iterable or promise to resolve to.
 * @returns {Promise} A promise to resolve to resulting array.
 */
const extractArrayFromArgument = async arg => Array.from(await Promise.resolve(arg));

export { extractResolvedArguments, extractArguments, extractArrayFromArgument };
