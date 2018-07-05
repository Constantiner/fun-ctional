import isIterable from "./isIterable";

const extractResolvedArguments = args =>
	args ? (args.length === 1 && isIterable(args[0]) ? Array.from(args[0]) : args) : [];

/**
 * Returns an array of values from arguments of some function.
 * Arguments can be passed as arguments list ar as single iterable parameter.
 *
 * @param {array} vals are input array (just arguments of some other function).
 * If if consists of one element and this element is an iterable returns array from it.
 * It can be an array of single promise to resolve to an array or iterable.
 * @returns {Promise} A promise to resolve to resulting array of arguments.
 */
const extractArguments = async vals => extractResolvedArguments(vals.length === 1 ? await Promise.resolve(vals) : vals);

export { extractResolvedArguments, extractArguments };
