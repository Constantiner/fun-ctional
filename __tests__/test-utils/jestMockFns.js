import { access } from "fs";

const getMockFn = jest => (fn, name) => jest.fn(fn).mockName(name);
const squareMock = (jest, name) => getMockFn(jest)(n => n * n, name);
const identityMock = (jest, name) => getMockFn(jest)(n => n, name);
const incrementMock = (jest, name) => getMockFn(jest)(n => n + 1, name);
const concatenateTestStringMock = (jest, name) => getMockFn(jest)(n => n + "test", name);
const sumReduceFnMock = (jest, name) => getMockFn(jest)((acc, value) => acc + value, name);
const deductionReduceFnMock = (jest, name) => getMockFn(jest)((acc, value) => acc - value, name);
const concatenationReduceFnMock = (jest, name) => getMockFn(jest)((acc, value) => `${acc}${value}`, name);
const mockFnArgumentsExpectations = (mockFn, nthCall, ...args) =>
	expect(mockFn).toHaveBeenNthCalledWith(nthCall, ...args);
const mockFnReturnValueExpectations = (mockFn, nthCall, returnValue) =>
	expect(mockFn).toHaveNthReturnedWith(nthCall, returnValue);

const mockFnExpectations = (mockFn, nthCall, returnValue, ...args) => {
	try {
		mockFnArgumentsExpectations(mockFn, nthCall, ...args);
		mockFnReturnValueExpectations(mockFn, nthCall, returnValue);
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
	identityMock,
	concatenateTestStringMock,
	mockFnArgumentsExpectations,
	mockFnReturnValueExpectations,
	mockFnExpectations,
	sumReduceFnMock,
	deductionReduceFnMock,
	concatenationReduceFnMock
};
