import afilter from "../src/afilter";
import { getMockFn, mockFnExpectations } from "./test-utils/jestMockFns";
import { createAsyncPromise } from "./test-utils/promiseUtils";

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
});
