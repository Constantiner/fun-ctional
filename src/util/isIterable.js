/**
 * Checks if parameter is an iterable.
 * 
 * @param {any} obj is target to check.
 * @returns {boolean} Result of checking.
 */
export default obj => Array.isArray(obj) || ((obj || obj === "") && typeof obj[Symbol.iterator] === "function");
