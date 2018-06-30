import { getError } from "./errorUtils";

const createAsyncPromise = (mapFn = n => n, successful = true) => (inputValue) =>
	new Promise((resolve, reject) =>
		setTimeout(() => (successful ? resolve(mapFn(inputValue)) : reject(getError(inputValue))), 100)
	);
const createSyncPromise = (mapFn = n => n, successful = true) => (inputValue) =>
	successful ? Promise.resolve(mapFn(inputValue)) : Promise.reject(getError(inputValue));

export { createAsyncPromise, createSyncPromise };
