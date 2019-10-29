import afilterSeq from "../src/afilterSeq";
import { getErrorMessage } from "./test-utils/errorUtils";
import { getMockFn, mockFnArgumentsExpectations, mockFnExpectations, squareMock } from "./test-utils/jestMockFns";
import { createAsyncPromise, createSyncPromise } from "./test-utils/promiseUtils";

describe("afilterSeq tests", () => {
	it("should work for promise resolved to list", async () => {
		expect.assertions(8);
		const input1 = 4;
		const input2 = 15;
		const input3 = 5;
		const inputValue = [input1, input2, input3];
		const filterFn = getMockFn(jest)(n => n - 15, "filterFn");
		const result = await afilterSeq(filterFn)(createAsyncPromise(n => new Set(n))(inputValue));
		expect(result).toEqual([input1, input3]);
		expect(filterFn).toHaveBeenCalledTimes(3);
		mockFnExpectations(filterFn, 1, -11, input1, 0, inputValue);
		mockFnExpectations(filterFn, 2, 0, input2, 1, inputValue);
		mockFnExpectations(filterFn, 3, -10, input3, 2, inputValue);
	});
	it("should work for promise resolved to list in sequence", async () => {
		expect.assertions(8);
		const input1 = 4;
		const input2 = 15;
		const input3 = 5;
		const inputValue = [input1, input2, input3];
		const filterFn = getMockFn(jest)(n => n - 15, "filterFn");
		const result = await afilterSeq(filterFn)(createAsyncPromise(n => new Set(n))(inputValue));
		expect(result).toEqual([input1, input3]);
		expect(filterFn).toHaveBeenCalledTimes(3);
		mockFnExpectations(filterFn, 1, -11, input1, 0, inputValue);
		mockFnExpectations(filterFn, 2, 0, input2, 1, inputValue);
		mockFnExpectations(filterFn, 3, -10, input3, 2, inputValue);
	});
	it("should reject if function is rejected with promises as input in sequence", async () => {
		expect.assertions(7);
		const input1 = 4;
		const input2 = 5;
		const dangerousFilterFn = getMockFn(jest)(n => n.first.second * n.first.second > 10, "dangerousFn");
		const squareInPromise = squareMock(jest, "squareInPromise");
		const getObjectFromInt = getMockFn(jest)(n => ({ first: { second: n } }), "getObjectFromInt");
		await expect(
			afilterSeq(dangerousFilterFn)([
				createAsyncPromise(squareInPromise)(input1),
				createSyncPromise(getObjectFromInt)(input2)
			])
		).rejects.toThrow(new TypeError("Cannot read property 'second' of undefined"));
		mockFnExpectations(getObjectFromInt, 1, { first: { second: input2 } }, input2);
		mockFnExpectations(squareInPromise, 1, 16, input1);
		expect(dangerousFilterFn).toHaveBeenCalledTimes(1);
		mockFnArgumentsExpectations(dangerousFilterFn, 1, 16, 0, [16, { first: { second: input2 } }]);
	});
	it("should work with promise in sequence", async () => {
		expect.assertions(6);
		const input1 = 4;
		const input2 = 5;
		const inputValue = [input1, input2];
		const filterFn = getMockFn(jest)(n => n < 10, "filterFn");
		const result = await afilterSeq(createAsyncPromise(filterFn))(new Set(inputValue));
		expect(result).toEqual(inputValue);
		expect(filterFn).toHaveBeenCalledTimes(2);
		mockFnExpectations(filterFn, 1, true, input1, 0, inputValue);
		mockFnExpectations(filterFn, 2, true, input2, 1, inputValue);
	});
	it("should reject with rejected promise in sequence", async () => {
		expect.assertions(2);
		const input1 = 4;
		const input2 = 5;
		const inputValue = [input1, input2];
		const filterFn = getMockFn(jest)(n => n < 10, "filterFn");
		await expect(afilterSeq(createAsyncPromise(filterFn, false))(new Set(inputValue))).rejects.toThrow(
			new Error(getErrorMessage([input1, 0, inputValue]))
		);
		expect(filterFn).not.toHaveBeenCalled();
	});
});
