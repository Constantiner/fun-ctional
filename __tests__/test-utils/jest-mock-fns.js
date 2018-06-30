const getMockFn = jest => (fn, name) => jest.fn(fn).mockName(name);
const squareMock = (jest, name) => getMockFn(jest)(n => n * n, name);
const incrementMock = (jest, name) => getMockFn(jest)(n => n + 1, name);
const concatenateTestStringMock = (jest, name) => getMockFn(jest)(n => n + "test", name);
const mockFnArgumentsExpectations = (mockFn, ...args) => expect(mockFn).toBeCalledWith(...args);
const mockFnReturnValueExpectations = (mockFn, returnValue) => expect(mockFn).toHaveReturnedWith(returnValue);
const mockFnExpectations = (mockFn, returnValue, ...args) => {
	try {
		mockFnArgumentsExpectations(mockFn, ...args);
		mockFnReturnValueExpectations(mockFn, returnValue);
	} catch (e) {
		/* eslint-disable-next-line no-console */
		console.error(mockFn.getMockName());
		throw e;
	}
};

export {
	getMockFn,
	squareMock,
	incrementMock,
	concatenateTestStringMock,
	mockFnArgumentsExpectations,
	mockFnReturnValueExpectations,
	mockFnExpectations
};
