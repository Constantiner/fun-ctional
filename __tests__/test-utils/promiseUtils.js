import { getError } from "./errorUtils";

const createAsyncPromise = (mapFn = n => n) => (inputValue, successful = true) =>
	new Promise((resolve, reject) =>
		setTimeout(() => (successful ? resolve(mapFn(inputValue)) : reject(getError(inputValue))), 100)
	);
const createSyncPromise = (mapFn = n => n) => (inputValue, successful = true) =>
	successful ? Promise.resolve(mapFn(inputValue)) : Promise.reject(getError(inputValue));

export { createAsyncPromise, createSyncPromise };
