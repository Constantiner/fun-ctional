import amapSeq from "../src/amapSeq";
import { getErrorMessage } from "./test-utils/errorUtils";
import { getMockFn, mockFnArgumentsExpectations, mockFnExpectations, squareMock } from "./test-utils/jestMockFns";
import { createAsyncPromise, createSyncPromise } from "./test-utils/promiseUtils";

describe("amapSeq tests", () => {
	it("should work for base case", async () => {
		expect.assertions(6);
		const input1 = 4;
		const input2 = 5;
		const inputValue = [input1, input2];
		const square = squareMock(jest, "square");
		const result = await amapSeq(square)(inputValue);
		expect(result).toEqual([16, 25]);
		expect(square).toHaveBeenCalledTimes(2);
		mockFnExpectations(square, 1, 16, input1, 0, inputValue);
		mockFnExpectations(square, 2, 25, input2, 1, inputValue);
	});
	it("should reject for failed promise as input in sequence", async () => {
		expect.assertions(3);
		const input1 = 4;
		const input2 = 5;
		const inputValue = [input1, input2];
		const square = squareMock(jest, "square");
		try {
			await amapSeq(square)(createAsyncPromise(n => new Set(n), false)(inputValue));
			expect(true).toBe(false);
		} catch (e) {
			expect(e).toBeInstanceOf(Error);
			expect(e.message).toBe(getErrorMessage(inputValue));
			expect(square).not.toHaveBeenCalled();
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
			await amapSeq(dangerousFn)([
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
	it("should work with promise in sequence", async () => {
		expect.assertions(6);
		const input1 = 4;
		const input2 = 5;
		const inputValue = [input1, input2];
		const square = squareMock(jest, "square");
		const result = await amapSeq(createAsyncPromise(square))(new Set(inputValue));
		expect(result).toEqual([16, 25]);
		expect(square).toHaveBeenCalledTimes(2);
		mockFnExpectations(square, 1, 16, input1, 0, inputValue);
		mockFnExpectations(square, 2, 25, input2, 1, inputValue);
	});
});
