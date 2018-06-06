const getErrorMessage = value => `Error with value "${value}"`;
const getError = value => new Error(getErrorMessage(value));
const createAsyncPromise = (valueToResolve, successful = true) =>
	new Promise((resolve, reject) =>
		setTimeout(() => (successful ? resolve(valueToResolve) : reject(getError(valueToResolve))), 100)
	);
const createSyncPromise = (valueToResolve, successful = true) =>
	successful ? Promise.resolve(valueToResolve) : Promise.reject(getError(valueToResolve));

export { getErrorMessage, createAsyncPromise, createSyncPromise };
