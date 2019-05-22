import { getError } from "./errorUtils";

const createAsyncPromise = (
	mapFn = (...mapFnArguments) => (mapFnArguments.length === 1 ? mapFnArguments[0] : mapFnArguments),
	successful = true,
	timeout = 100
) => (...inputValueArguments) =>
	new Promise((resolve, reject) =>
		setTimeout(
			() => (successful ? resolve(mapFn(...inputValueArguments)) : reject(getError(...inputValueArguments))),
			timeout
		)
	);
const createSyncPromise = (
	mapFn = (...mapFnArguments) => (mapFnArguments.length === 1 ? mapFnArguments[0] : mapFnArguments),
	successful = true
) => async (...inputValueArguments) =>
	successful ? mapFn(...inputValueArguments) : Promise.reject(getError(...inputValueArguments));

export { createAsyncPromise, createSyncPromise };
