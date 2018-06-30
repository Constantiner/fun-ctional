import isIterable from "./is-iterable";
/**
 * Returns an array of functions.
 * 
 * @param {array} fns Are input array (just arguments of some other function).
 * If if consists of one element and this element is an iterable returns array from it.
 * @returns {array} Resulting array of functions.
 */
export default fns => (fns.length === 1 && isIterable(fns[0]) ? Array.from(fns[0]) : fns);
