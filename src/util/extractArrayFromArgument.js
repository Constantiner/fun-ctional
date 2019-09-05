/* eslint-disable unicorn/prefer-spread */
/**
 * Returns a promise which resolved to array of values from a passed iterable.
 * An iterable can be a promise to resolve to iterable and then to array.
 *
 * @param {Promise|Iterable.<*>} arrayLike Is iterable or promise to resolve to.
 * @returns {Promise} A promise to resolve to resulting array.
 */
const extractArrayFromArgument = async arrayLike => Array.from(await Promise.resolve(arrayLike));

export { extractArrayFromArgument };
