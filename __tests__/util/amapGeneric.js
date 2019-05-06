import amapGeneric from "../../src/util/amapGeneric";
import { getErrorMessage } from "../test-utils/errorUtils";
import {
	getMockFn,
	incrementMock,
	mockFnArgumentsExpectations,
	mockFnExpectations,
	squareMock
} from "../test-utils/jestMockFns";
import { createAsyncPromise, createSyncPromise } from "../test-utils/promiseUtils";

describe("amapGeneric tests", () => {
	it("should work for base case", async () => {
		expect.assertions(6);
		const input1 = 4;
		const input2 = 5;
		const inputValue = [input1, input2];
		const square = squareMock(jest, "square");
		const result = await amapGeneric()(square)(inputValue);
		expect(result).toEqual([16, 25]);
		expect(square).toHaveBeenCalledTimes(2);
		mockFnExpectations(square, 1, 16, input1, 0, inputValue);
		mockFnExpectations(square, 2, 25, input2, 1, inputValue);
	});
	it("should work for base case with list", async () => {
		expect.assertions(6);
		const input1 = 4;
		const input2 = 5;
		const inputValue = [input1, input2];
		const square = squareMock(jest, "square");
		const result = await amapGeneric()(square)(new Set(inputValue));
		expect(result).toEqual([16, 25]);
		expect(square).toHaveBeenCalledTimes(2);
		mockFnExpectations(square, 1, 16, input1, 0, inputValue);
		mockFnExpectations(square, 2, 25, input2, 1, inputValue);
	});
	it("should work for promise resolved to list", async () => {
		expect.assertions(6);
		const input1 = 4;
		const input2 = 5;
		const inputValue = [input1, input2];
		const square = squareMock(jest, "square");
		const result = await amapGeneric()(square)(createAsyncPromise(n => new Set(n))(inputValue));
		expect(result).toEqual([16, 25]);
		expect(square).toHaveBeenCalledTimes(2);
		mockFnExpectations(square, 1, 16, input1, 0, inputValue);
		mockFnExpectations(square, 2, 25, input2, 1, inputValue);
	});
	it("should reject for failed promise as input in parallel", async () => {
		expect.assertions(3);
		const input1 = 4;
		const input2 = 5;
		const inputValue = [input1, input2];
		const square = squareMock(jest, "square");
		try {
			await amapGeneric()(square)(createAsyncPromise(n => new Set(n), false)(inputValue));
			expect(true).toBe(false);
		} catch (e) {
			expect(e).toBeInstanceOf(Error);
			expect(e.message).toBe(getErrorMessage(inputValue));
			expect(square).not.toHaveBeenCalled();
		}
	});
	it("should reject for failed promise as input in sequence", async () => {
		expect.assertions(3);
		const input1 = 4;
		const input2 = 5;
		const inputValue = [input1, input2];
		const square = squareMock(jest, "square");
		try {
			await amapGeneric(true)(square)(createAsyncPromise(n => new Set(n), false)(inputValue));
			expect(true).toBe(false);
		} catch (e) {
			expect(e).toBeInstanceOf(Error);
			expect(e.message).toBe(getErrorMessage(inputValue));
			expect(square).not.toHaveBeenCalled();
		}
	});
	it("should work with promise and value as input", async () => {
		expect.assertions(8);
		const input1 = 4;
		const input2 = 5;
		const square = squareMock(jest, "square");
		const increment = incrementMock(jest, "increment");
		const result = await amapGeneric()(square)(new Set([input1, createAsyncPromise(increment)(input2)]));
		expect(result).toEqual([16, 36]);
		expect(square).toHaveBeenCalledTimes(2);
		mockFnExpectations(increment, 1, 6, input2);
		mockFnExpectations(square, 1, 16, input1, 0, [input1, 6]);
		mockFnExpectations(square, 2, 36, 6, 1, [input1, 6]);
	});
	it("should work with promises as input", async () => {
		expect.assertions(10);
		const input1 = 4;
		const input2 = 5;
		const square = squareMock(jest, "square");
		const squareInPromise = squareMock(jest, "squareInPromise");
		const increment = incrementMock(jest, "increment");
		const result = await amapGeneric()(square)([
			createAsyncPromise(squareInPromise)(input1),
			createSyncPromise(increment)(input2)
		]);
		expect(result).toEqual([256, 36]);
		expect(square).toHaveBeenCalledTimes(2);
		mockFnExpectations(increment, 1, 6, input2);
		mockFnExpectations(squareInPromise, 1, 16, input1);
		mockFnExpectations(square, 1, 256, 16, 0, [16, 6]);
		mockFnExpectations(square, 2, 36, 6, 1, [16, 6]);
	});
	it("should reject with rejected promise as input", async () => {
		expect.assertions(6);
		const input1 = 4;
		const input2 = 5;
		const square = squareMock(jest, "square");
		const squareInPromise = squareMock(jest, "squareInPromise");
		const increment = incrementMock(jest, "increment");
		try {
			await amapGeneric()(square)([
				createAsyncPromise(squareInPromise, false)(input1),
				createSyncPromise(increment)(input2)
			]);
			expect(true).toBe(false);
		} catch (e) {
			expect(e).toBeInstanceOf(Error);
			expect(e.message).toBe(getErrorMessage(input1));
			expect(square).not.toHaveBeenCalled();
			mockFnExpectations(increment, 1, 6, input2);
			expect(squareInPromise).not.toHaveBeenCalled();
		}
	});
	it("should reject if function is rejected with promises as input", async () => {
		expect.assertions(8);
		const input1 = 4;
		const input2 = 5;
		const dangerousFn = getMockFn(jest)(n => n.first.second * n.first.second, "dangerousFn");
		const squareInPromise = squareMock(jest, "squareInPromise");
		const getObjectFromInt = getMockFn(jest)(n => ({ first: { second: n } }), "getObjectFromInt");
		try {
			await amapGeneric()(dangerousFn)([
				createAsyncPromise(squareInPromise)(input1),
				createSyncPromise(getObjectFromInt)(input2)
			]);
			expect(true).toBe(false);
		} catch (e) {
			expect(e).toBeInstanceOf(TypeError);
			expect(e.message).toBe("Cannot read property 'second' of undefined");
			mockFnExpectations(getObjectFromInt, 1, { first: { second: input2 } }, input2);
			mockFnExpectations(squareInPromise, 1, 16, input1);
			expect(dangerousFn).toHaveBeenCalledTimes(1);
			mockFnArgumentsExpectations(dangerousFn, 1, 16, 0, [16, { first: { second: input2 } }]);
		}
	});
	it("should reject if function is rejected promise with promises as input in parallel", async () => {
		expect.assertions(9);
		const input1 = 4;
		const input2 = 5;
		const dangerousFn = getMockFn(jest)(async n => n.first.second * n.first.second, "dangerousFn");
		const squareInPromise = squareMock(jest, "squareInPromise");
		const getObjectFromInt = getMockFn(jest)(n => ({ first: { second: n } }), "getObjectFromInt");
		try {
			await amapGeneric()(dangerousFn)([
				createAsyncPromise(squareInPromise)(input1),
				createSyncPromise(getObjectFromInt)(input2)
			]);
			expect(true).toBe(false);
		} catch (e) {
			expect(e).toBeInstanceOf(TypeError);
			expect(e.message).toBe("Cannot read property 'second' of undefined");
			mockFnExpectations(getObjectFromInt, 1, { first: { second: input2 } }, input2);
			mockFnExpectations(squareInPromise, 1, 16, input1);
			expect(dangerousFn).toHaveBeenCalledTimes(2);
			mockFnArgumentsExpectations(dangerousFn, 1, 16, 0, [16, { first: { second: input2 } }]);
			mockFnArgumentsExpectations(dangerousFn, 2, { first: { second: input2 } }, 1, [
				16,
				{ first: { second: input2 } }
			]);
		}
	});
	it("should reject if function is rejected promise with promises as input in sequence", async () => {
		expect.assertions(8);
		const input1 = 4;
		const input2 = 5;
		const dangerousFn = getMockFn(jest)(async n => n.first.second * n.first.second, "dangerousFn");
		const squareInPromise = squareMock(jest, "squareInPromise");
		const getObjectFromInt = getMockFn(jest)(n => ({ first: { second: n } }), "getObjectFromInt");
		try {
			await amapGeneric(true)(dangerousFn)([
				createAsyncPromise(squareInPromise)(input1),
				createSyncPromise(getObjectFromInt)(input2)
			]);
			expect(true).toBe(false);
		} catch (e) {
			expect(e).toBeInstanceOf(TypeError);
			expect(e.message).toBe("Cannot read property 'second' of undefined");
			mockFnExpectations(getObjectFromInt, 1, { first: { second: input2 } }, input2);
			mockFnExpectations(squareInPromise, 1, 16, input1);
			expect(dangerousFn).toHaveBeenCalledTimes(1);
			mockFnArgumentsExpectations(dangerousFn, 1, 16, 0, [16, { first: { second: input2 } }]);
		}
	});
	it("should work with promise in parallel", async () => {
		expect.assertions(6);
		const input1 = 4;
		const input2 = 5;
		const inputValue = [input1, input2];
		const square = squareMock(jest, "square");
		const result = await amapGeneric()(createAsyncPromise(square))(new Set(inputValue));
		expect(result).toEqual([16, 25]);
		expect(square).toHaveBeenCalledTimes(2);
		mockFnExpectations(square, 1, 16, input1, 0, inputValue);
		mockFnExpectations(square, 2, 25, input2, 1, inputValue);
	});
	it("should work with promise in sequence", async () => {
		expect.assertions(6);
		const input1 = 4;
		const input2 = 5;
		const inputValue = [input1, input2];
		const square = squareMock(jest, "square");
		const result = await amapGeneric(true)(createAsyncPromise(square))(new Set(inputValue));
		expect(result).toEqual([16, 25]);
		expect(square).toHaveBeenCalledTimes(2);
		mockFnExpectations(square, 1, 16, input1, 0, inputValue);
		mockFnExpectations(square, 2, 25, input2, 1, inputValue);
	});
	it("should reject with rejected promise", async () => {
		expect.assertions(3);
		const input1 = 4;
		const input2 = 5;
		const inputValue = [input1, input2];
		const square = squareMock(jest, "square");
		try {
			await amapGeneric()(createAsyncPromise(square, false))(new Set(inputValue));
			expect(true).toBe(false);
		} catch (e) {
			expect(e).toBeInstanceOf(Error);
			expect(e.message).toBe(getErrorMessage([input1, 0, inputValue]));
			expect(square).not.toHaveBeenCalled();
		}
	});
	it("should reject with rejected promise traditional way", () => {
		expect.assertions(4);
		const input1 = 4;
		const input2 = 5;
		const inputValue = [input1, input2];
		const square = squareMock(jest, "square");
		const promiseMapFn = incrementMock(jest, "promiseMapFn");
		return amapGeneric()(createAsyncPromise(square, false))(new Set(inputValue))
			.then(promiseMapFn)
			.catch(e => {
				expect(e).toBeInstanceOf(Error);
				expect(e.message).toBe(getErrorMessage([input1, 0, inputValue]));
				expect(square).not.toHaveBeenCalled();
				expect(promiseMapFn).not.toHaveBeenCalled();
			});
	});
});
