import { extractArrayFromArgument } from "./extractArrayFromArgument";

const getMappedInParallel = (mapFn, array) => Promise.all(array.map(mapFn));

const getMappedInSequence = async (mapFn, array) =>
	array.reduce(
		(promise, element, index, originalArray) =>
			promise.then(async current => [...current, await mapFn(element, index, originalArray)]),
		Promise.resolve([])
	);

const amapGeneric = mapImpl => mapFn => async iterable => {
	const sourceArray = await extractArrayFromArgument(iterable);
	const array = await Promise.all(sourceArray);
	return mapImpl(mapFn, array);
};

export { amapGeneric, getMappedInParallel, getMappedInSequence };
