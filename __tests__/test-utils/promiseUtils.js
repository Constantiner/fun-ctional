import { getError } from "./errorUtils";

const createAsyncPromise = (
	mapFn = (...mapFnArgs) => (mapFnArgs.length === 1 ? mapFnArgs[0] : mapFnArgs),
	successful = true
) => (...inputValueArgs) =>
	new Promise((resolve, reject) =>
		setTimeout(() => (successful ? resolve(mapFn(...inputValueArgs)) : reject(getError(...inputValueArgs))), 100)
	);
const createSyncPromise = (
	mapFn = (...mapFnArgs) => (mapFnArgs.length === 1 ? mapFnArgs[0] : mapFnArgs),
	successful = true
) => (...inputValueArgs) =>
	successful ? Promise.resolve(mapFn(...inputValueArgs)) : Promise.reject(getError(...inputValueArgs));

export { createAsyncPromise, createSyncPromise };
