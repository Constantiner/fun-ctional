import isIterable from "./isIterable";
/**
 * Returns an array of values from arguments of some function.
 * Arguments can be passed as arguments list ar as single iterable parameter.
 *
 * @param {array} vals are input array (just arguments of some other function).
 * If if consists of one element and this element is an iterable returns array from it.
 * @returns {array} Resulting array of arguments.
 */
export default vals => (vals ? (vals.length === 1 && isIterable(vals[0]) ? Array.from(vals[0]) : vals) : []);
