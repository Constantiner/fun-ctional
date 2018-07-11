const getErrorMessage = (...args) => `Error with value "${args.length === 1 ? args[0] : args}"`;
const getError = (...args) => new Error(getErrorMessage(...args));

export { getErrorMessage, getError };
