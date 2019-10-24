/* eslint-disable unicorn/prefer-spread */
import { PromiseEnabledIterableOrArrayLike, IterableOrArrayLike, AsyncData } from "types/iterables";

const resolveIterablesToArray = async <T>(
	iterableOrArrayLike: PromiseEnabledIterableOrArrayLike<T>
): Promise<AsyncData<T>[]> => {
	const resolvedIterableOrArrayLike: IterableOrArrayLike<T> = await Promise.resolve(iterableOrArrayLike);
	return Array.from(resolvedIterableOrArrayLike);
};

/**
 * Returns a promise which resolved to array of values from a passed iterable.
 * An iterable can be a promise to resolve to iterable and then to array.
 *
 * @param iterableOrArrayLike Is iterable or promise to resolve to.
 * @returns A promise to resolve to resulting array.
 */
const extractArrayFromArgument = async <T>(iterableOrArrayLike: PromiseEnabledIterableOrArrayLike<T>): Promise<T[]> =>
	Promise.all(await resolveIterablesToArray(iterableOrArrayLike));

const extractArrayOfPromisesFromArgument = async <T>(
	iterableOrArrayLike: PromiseEnabledIterableOrArrayLike<T>
): Promise<Promise<T>[]> => (await resolveIterablesToArray(iterableOrArrayLike)).map(value => Promise.resolve(value));

export { extractArrayFromArgument, extractArrayOfPromisesFromArgument, resolveIterablesToArray };
