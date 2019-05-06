import isIterable from "./isIterable";

/**
 * Returns an array of values from arguments of some function.
 * Arguments can be passed as arguments list ar as single iterable parameter.
 *
 * @param {array} args are input array (just arguments of some other function).
 * If if consists of one element and this element is an iterable returns array from it.
 * @returns {Promise} Resulting array of arguments.
 */
const extractResolvedArguments = args => (args ? (args.length === 1 && isIterable(args[0]) ? [...args[0]] : args) : []);

export default extractResolvedArguments;
