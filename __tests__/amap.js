import amap from "../src/amap";
import { getErrorMessage } from "./test-utils/errorUtils";
import {
	getMockFn,
	incrementMock,
	mockFnArgumentsExpectations,
	mockFnExpectations,
	squareMock
} from "./test-utils/jestMockFns";
import { createAsyncPromise, createSyncPromise } from "./test-utils/promiseUtils";

describe("amap tests", () => {
	it("should work for base case", async () => {
		expect.assertions(6);
		const input1 = 4;
		const input2 = 5;
		const square = squareMock(jest, "square");
		const result = await amap(square)([input1, input2]);
		expect(result).toEqual([16, 25]);
		expect(square).toHaveBeenCalledTimes(2);
		mockFnExpectations(square, 1, 16, input1);
		mockFnExpectations(square, 2, 25, input2);
	});
	it("should work for base case with list", async () => {
		expect.assertions(6);
		const input1 = 4;
		const input2 = 5;
		const square = squareMock(jest, "square");
		const result = await amap(square)(new Set([input1, input2]));
		expect(result).toEqual([16, 25]);
		expect(square).toHaveBeenCalledTimes(2);
		mockFnExpectations(square, 1, 16, input1);
		mockFnExpectations(square, 2, 25, input2);
	});
	it("should work for promise resolved to list", async () => {
		expect.assertions(6);
		const input1 = 4;
		const input2 = 5;
		const square = squareMock(jest, "square");
		const result = await amap(square)(createAsyncPromise(n => new Set(n))([input1, input2]));
		expect(result).toEqual([16, 25]);
		expect(square).toHaveBeenCalledTimes(2);
		mockFnExpectations(square, 1, 16, input1);
		mockFnExpectations(square, 2, 25, input2);
	});
	it("should reject for failed promise as input", async () => {
		expect.assertions(3);
		const input1 = 4;
		const input2 = 5;
		const square = squareMock(jest, "square");
		try {
			await amap(square)(createAsyncPromise(n => new Set(n), false)([input1, input2]));
		} catch (e) {
			expect(e).toBeInstanceOf(Error);
			expect(e.message).toBe(getErrorMessage([input1, input2]));
			expect(square).not.toBeCalled();
		}
	});
	it("should work with promise and value as input", async () => {
		expect.assertions(8);
		const input1 = 4;
		const input2 = 5;
		const square = squareMock(jest, "square");
		const increment = incrementMock(jest, "increment");
		const result = await amap(square)(new Set([input1, createAsyncPromise(increment)(input2)]));
		expect(result).toEqual([16, 36]);
		expect(square).toHaveBeenCalledTimes(2);
		mockFnExpectations(increment, 1, 6, input2);
		mockFnExpectations(square, 1, 16, input1);
		mockFnExpectations(square, 2, 36, 6);
	});
	it("should work with promises as input", async () => {
		expect.assertions(10);
		const input1 = 4;
		const input2 = 5;
		const square = squareMock(jest, "square");
		const squareInPromise = squareMock(jest, "squareInPromise");
		const increment = incrementMock(jest, "increment");
		const result = await amap(square)([
			createAsyncPromise(squareInPromise)(input1),
			createSyncPromise(increment)(input2)
		]);
		expect(result).toEqual([256, 36]);
		expect(square).toHaveBeenCalledTimes(2);
		mockFnExpectations(increment, 1, 6, input2);
		mockFnExpectations(squareInPromise, 1, 16, input1);
		mockFnExpectations(square, 1, 36, 6);
		mockFnExpectations(square, 2, 256, 16);
	});
	it("should reject with rejected promise as input", async () => {
		expect.assertions(8);
		const input1 = 4;
		const input2 = 5;
		const square = squareMock(jest, "square");
		const squareInPromise = squareMock(jest, "squareInPromise");
		const increment = incrementMock(jest, "increment");
		try {
			await amap(square)([
				createAsyncPromise(squareInPromise, false)(input1),
				createSyncPromise(increment)(input2)
			]);
		} catch (e) {
			expect(e).toBeInstanceOf(Error);
			expect(e.message).toBe(getErrorMessage(input1));
			expect(square).toHaveBeenCalledTimes(1);
			mockFnExpectations(increment, 1, 6, input2);
			expect(squareInPromise).not.toBeCalled();
			mockFnExpectations(square, 1, 36, 6);
		}
	});
	it("should reject if function is rejected with promises as input", async () => {
		expect.assertions(10);
		const input1 = 4;
		const input2 = 5;
		const dangerousFn = getMockFn(jest)(n => n.first.second * n.first.second, "dangerousFn");
		const squareInPromise = squareMock(jest, "squareInPromise");
		const getObjFromInt = getMockFn(jest)(n => ({ first: { second: n } }), "getObjFromInt");
		try {
			await amap(dangerousFn)([
				createAsyncPromise(squareInPromise)(input1),
				createSyncPromise(getObjFromInt)(input2)
			]);
		} catch (e) {
			expect(e).toBeInstanceOf(TypeError);
			expect(e.message).toBe("Cannot read property 'second' of undefined");
			mockFnExpectations(getObjFromInt, 1, { first: { second: input2 } }, input2);
			mockFnExpectations(squareInPromise, 1, 16, input1);
			expect(dangerousFn).toHaveBeenCalledTimes(2);
			mockFnExpectations(dangerousFn, 1, 25, { first: { second: input2 } });
			mockFnArgumentsExpectations(dangerousFn, 2, 16);
		}
	});
	it("should work with promise", async () => {
		expect.assertions(6);
		const input1 = 4;
		const input2 = 5;
		const square = squareMock(jest, "square");
		const result = await amap(createAsyncPromise(square))(new Set([input1, input2]));
		expect(result).toEqual([16, 25]);
		expect(square).toHaveBeenCalledTimes(2);
		mockFnExpectations(square, 1, 16, input1);
		mockFnExpectations(square, 2, 25, input2);
	});
	it("should reject with rejected promise", async () => {
		expect.assertions(3);
		const input1 = 4;
		const input2 = 5;
		const square = squareMock(jest, "square");
		try {
			await amap(createAsyncPromise(square, false))(new Set([input1, input2]));
		} catch (e) {
			expect(e).toBeInstanceOf(Error);
			expect(e.message).toBe(getErrorMessage(input1));
			expect(square).not.toBeCalled();
		}
	});
	it("should reject with rejected promise traditional way", () => {
		expect.assertions(4);
		const input1 = 4;
		const input2 = 5;
		const square = squareMock(jest, "square");
		const promiseMapFn = incrementMock(jest, "promiseMapFn");
		return amap(createAsyncPromise(square, false))(new Set([input1, input2]))
			.then(promiseMapFn)
			.catch(e => {
				expect(e).toBeInstanceOf(Error);
				expect(e.message).toBe(getErrorMessage(input1));
				expect(square).not.toBeCalled();
				expect(promiseMapFn).not.toBeCalled();
			});
	});
});
