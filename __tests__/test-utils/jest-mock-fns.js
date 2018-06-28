const getMockFn = jest => fn => jest.fn(fn);
const squareMock = jest => getMockFn(jest)(n => n * n);
const incrementMock = jest => getMockFn(jest)(n => n + 1);
const concatenateTestStringMock = jest => getMockFn(jest)(n => n + "test");
const mockFnArgumentsExpectations = (mockFn, ...args) => expect(mockFn).toBeCalledWith(...args);
const mockFnReturnValueExpectations = (mockFn, returnValue) => expect(mockFn).toHaveReturnedWith(returnValue);
const mockFnExpectations = (mockFn, returnValue, ...args) => {
	mockFnArgumentsExpectations(mockFn, ...args);
	mockFnReturnValueExpectations(mockFn, returnValue);
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
