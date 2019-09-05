import { extractArrayFromArgument } from "./extractArrayFromArgument";

const getMappedInParallel = (mapFn, array) => Promise.all(array.map(mapFn));

const getMappedInSequence = async (mapFn, array) => {
	const result = [];
	for (let i = 0; i < array.length; i++) {
		const mapResult = await mapFn(array[i], i, array);
		result.push(mapResult);
	}
	return result;
};

export default (sequence = false) => mapFn => async iterable => {
	const sourceArray = await extractArrayFromArgument(iterable);
	const array = await Promise.all(sourceArray);
	return sequence ? getMappedInSequence(mapFn, array) : getMappedInParallel(mapFn, array);
};
