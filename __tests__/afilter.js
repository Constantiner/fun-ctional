import afilter from "../src/afilter";
import { getErrorMessage } from "./test-utils/errorUtils";
import {
	getMockFn,
	incrementMock,
	mockFnArgumentsExpectations,
	mockFnExpectations,
	squareMock
} from "./test-utils/jestMockFns";
import { createAsyncPromise, createSyncPromise } from "./test-utils/promiseUtils";

describe("afilter tests", () => {
	it("should work for promise resolved to list", async () => {
		expect.assertions(8);
		const input1 = 4;
		const input2 = 15;
		const input3 = 5;
		const inputValue = [input1, input2, input3];
		const filterFn = getMockFn(jest)(n => n - 15, "filterFn");
		const result = await afilter(filterFn)(createAsyncPromise(n => new Set(n))(inputValue));
		expect(result).toEqual([input1, input3]);
		expect(filterFn).toHaveBeenCalledTimes(3);
		mockFnExpectations(filterFn, 1, -11, input1, 0, inputValue);
		mockFnExpectations(filterFn, 2, 0, input2, 1, inputValue);
		mockFnExpectations(filterFn, 3, -10, input3, 2, inputValue);
	});
	it("should work for base case", async () => {
		expect.assertions(8);
		const input1 = 4;
		const input2 = 15;
		const input3 = 5;
		const inputValue = [input1, input2, input3];
		const filterFn = getMockFn(jest)(n => n > 10, "filterFn");
		const result = await afilter(filterFn)(inputValue);
		expect(result).toEqual([input2]);
		expect(filterFn).toHaveBeenCalledTimes(3);
		mockFnExpectations(filterFn, 1, false, input1, 0, inputValue);
		mockFnExpectations(filterFn, 2, true, input2, 1, inputValue);
		mockFnExpectations(filterFn, 3, false, input3, 2, inputValue);
	});
	it("should work for base case with list", async () => {
		expect.assertions(8);
		const input1 = 4;
		const input2 = 15;
		const input3 = 5;
		const inputValue = [input1, input2, input3];
		const filterFn = getMockFn(jest)(n => n < 10, "filterFn");
		const result = await afilter(filterFn)(new Set(inputValue));
		expect(result).toEqual([input1, input3]);
		expect(filterFn).toHaveBeenCalledTimes(3);
		mockFnExpectations(filterFn, 1, true, input1, 0, inputValue);
		mockFnExpectations(filterFn, 2, false, input2, 1, inputValue);
		mockFnExpectations(filterFn, 3, true, input3, 2, inputValue);
	});
	it("should work for promise resolved to list in parallel", async () => {
		expect.assertions(8);
		const input1 = 4;
		const input2 = 15;
		const input3 = 5;
		const inputValue = [input1, input2, input3];
		const filterFn = getMockFn(jest)(n => n - 15, "filterFn");
		const result = await afilter(filterFn)(createAsyncPromise(n => new Set(n))(inputValue));
		expect(result).toEqual([input1, input3]);
		expect(filterFn).toHaveBeenCalledTimes(3);
		mockFnExpectations(filterFn, 1, -11, input1, 0, inputValue);
		mockFnExpectations(filterFn, 2, 0, input2, 1, inputValue);
		mockFnExpectations(filterFn, 3, -10, input3, 2, inputValue);
	});
	it("should reject for failed promise as input", async () => {
		expect.assertions(3);
		const input1 = 4;
		const input2 = 15;
		const input3 = 5;
		const inputValue = [input1, input2, input3];
		const filterFn = getMockFn(jest)(n => n < 10, "filterFn");
		try {
			await afilter(filterFn)(createAsyncPromise(n => new Set(n), false)(inputValue));
			expect(true).toBe(false);
		} catch (e) {
			expect(e).toBeInstanceOf(Error);
			expect(e.message).toBe(getErrorMessage(inputValue));
			expect(filterFn).not.toHaveBeenCalled();
		}
	});
	it("should work with promise and value as input", async () => {
		expect.assertions(10);
		const input1 = 4;
		const input2 = 15;
		const input3 = 5;
		const filterFn = getMockFn(jest)(n => n <= 16, "filterFn");
		const increment = incrementMock(jest, "increment");
		const result = await afilter(filterFn)(new Set([input1, createAsyncPromise(increment)(input2), input3]));
		const realInputValue = [input1, input2 + 1, input3];
		expect(result).toEqual(realInputValue);
		expect(filterFn).toHaveBeenCalledTimes(3);
		mockFnExpectations(increment, 1, 16, input2);
		mockFnExpectations(filterFn, 1, true, input1, 0, realInputValue);
		mockFnExpectations(filterFn, 2, true, input2 + 1, 1, realInputValue);
		mockFnExpectations(filterFn, 3, true, input3, 2, realInputValue);
	});
	it("should work with promises as input", async () => {
		expect.assertions(16);
		const input1 = 4;
		const input2 = 15;
		const input3 = 5;
		const filterFn = getMockFn(jest)(n => n > 16, "filterFn");
		const squareInPromise = squareMock(jest, "squareInPromise");
		const increment = incrementMock(jest, "increment");
		const result = await afilter(filterFn)([
			createAsyncPromise(squareInPromise)(input1),
			createSyncPromise(increment)(input2),
			createAsyncPromise(increment)(input3)
		]);
		const realInputValue = [16, 16, 6];
		expect(result).toEqual([]);
		expect(squareInPromise).toHaveBeenCalledTimes(1);
		mockFnExpectations(squareInPromise, 1, 16, input1);
		expect(increment).toHaveBeenCalledTimes(2);
		mockFnExpectations(increment, 1, 16, input2);
		mockFnExpectations(increment, 2, 6, input3);
		expect(filterFn).toHaveBeenCalledTimes(3);
		mockFnExpectations(filterFn, 1, false, 16, 0, realInputValue);
		mockFnExpectations(filterFn, 2, false, 16, 1, realInputValue);
		mockFnExpectations(filterFn, 3, false, 6, 2, realInputValue);
	});
	it("should reject with rejected promise as input", async () => {
		expect.assertions(9);
		const input1 = 4;
		const input2 = 15;
		const input3 = 5;
		const filterFn = getMockFn(jest)(n => n < 10, "filterFn");
		const squareInPromise = squareMock(jest, "squareInPromise");
		const increment = incrementMock(jest, "increment");
		try {
			await afilter(filterFn)([
				createSyncPromise(increment)(input1),
				createAsyncPromise(squareInPromise, false)(input2),
				createSyncPromise(increment)(input3)
			]);
			expect(true).toBe(false);
		} catch (e) {
			expect(e).toBeInstanceOf(Error);
			expect(e.message).toBe(getErrorMessage(input2));
			expect(filterFn).not.toHaveBeenCalled();
			expect(increment).toHaveBeenCalledTimes(2);
			mockFnExpectations(increment, 1, 5, input1);
			mockFnExpectations(increment, 2, 6, input3);
			expect(squareInPromise).not.toHaveBeenCalled();
		}
	});
	it("should reject if function is rejected with promises as input in parallel", async () => {
		expect.assertions(10);
		const input1 = 4;
		const input2 = 5;
		const dangerousFilterFn = getMockFn(jest)(n => n.first.second * n.first.second > 10, "dangerousFn");
		const squareInPromise = squareMock(jest, "squareInPromise");
		const getObjectFromInt = getMockFn(jest)(n => ({ first: { second: n } }), "getObjectFromInt");
		try {
			await afilter(dangerousFilterFn)([
				createAsyncPromise(squareInPromise)(input1),
				createSyncPromise(getObjectFromInt)(input2)
			]);
			expect(true).toBe(false);
		} catch (e) {
			expect(e).toBeInstanceOf(TypeError);
			expect(e.message).toBe("Cannot read property 'second' of undefined");
			mockFnExpectations(getObjectFromInt, 1, { first: { second: input2 } }, input2);
			mockFnExpectations(squareInPromise, 1, 16, input1);
			expect(dangerousFilterFn).toHaveBeenCalledTimes(2);
			mockFnArgumentsExpectations(dangerousFilterFn, 1, 16, 0, [16, { first: { second: input2 } }]);
			mockFnExpectations(dangerousFilterFn, 2, true, { first: { second: input2 } }, 1, [
				16,
				{ first: { second: input2 } }
			]);
		}
	});
	it("should work with promise in parallel", async () => {
		expect.assertions(6);
		const input1 = 4;
		const input2 = 5;
		const inputValue = [input1, input2];
		const filterFn = getMockFn(jest)(n => n < 10, "filterFn");
		const result = await afilter(createAsyncPromise(filterFn))(new Set(inputValue));
		expect(result).toEqual(inputValue);
		expect(filterFn).toHaveBeenCalledTimes(2);
		mockFnExpectations(filterFn, 1, true, input1, 0, inputValue);
		mockFnExpectations(filterFn, 2, true, input2, 1, inputValue);
	});
	it("should reject with rejected promise in parallel", async () => {
		expect.assertions(3);
		const input1 = 4;
		const input2 = 5;
		const inputValue = [input1, input2];
		const filterFn = getMockFn(jest)(n => n < 10, "filterFn");
		try {
			await afilter(createAsyncPromise(filterFn, false))(new Set(inputValue));
			expect(true).toBe(false);
		} catch (e) {
			expect(e).toBeInstanceOf(Error);
			expect(e.message).toBe(getErrorMessage([input1, 0, inputValue]));
			expect(filterFn).not.toHaveBeenCalled();
		}
	});
});
