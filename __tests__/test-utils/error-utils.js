const getErrorMessage = value => `Error with value "${value}"`;
const getError = value => new Error(getErrorMessage(value));

export { getErrorMessage, getError };
