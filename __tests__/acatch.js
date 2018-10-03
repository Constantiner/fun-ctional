import acatch from "../src/acatch";
import { getError } from "./test-utils/errorUtils";
import { getMockFn, incrementMock, mockFnExpectations } from "./test-utils/jestMockFns";
import { createAsyncPromise, createSyncPromise } from "./test-utils/promiseUtils";

describe("acatch tests", () => {
	it("should work for case without rejects", async () => {
		expect.assertions(3);
		const input = 7;
		const catchFn = getMockFn(jest)(() => input * 4, "catchFn");
		const catchInCatchBlockFn = getMockFn(jest)(() => input * 17, "catchInCatchBlockFn");
		const result = await acatch(catchFn)(input).catch(catchInCatchBlockFn);
		expect(result).toBe(input);
		expect(catchFn).not.toBeCalled();
		expect(catchInCatchBlockFn).not.toBeCalled();
	});
	it("should work for case with promise on input without reject", async () => {
		expect.assertions(6);
		const input = 7;
		const increment = incrementMock(jest, "increment");
		const catchFn = getMockFn(jest)(() => input * 4, "catchFn");
		const catchInCatchBlockFn = getMockFn(jest)(() => input * 17, "catchInCatchBlockFn");
		const result = await acatch(catchFn)(createSyncPromise(increment)(input)).catch(catchInCatchBlockFn);
		expect(result).toBe(8);
		mockFnExpectations(increment, 1, 8, input);
		expect(increment).toHaveBeenCalledTimes(1);
		expect(catchFn).not.toBeCalled();
		expect(catchInCatchBlockFn).not.toBeCalled();
	});
	it("should catch for case with rejected promise on input", async () => {
		expect.assertions(6);
		const input = 7;
		const increment = incrementMock(jest, "increment");
		const catchFn = getMockFn(jest)(() => input * 4, "catchFn");
		const catchInCatchBlockFn = getMockFn(jest)(() => input * 17, "catchInCatchBlockFn");
		const result = await acatch(catchFn)(createAsyncPromise(increment, false)(input)).catch(catchInCatchBlockFn);
		expect(result).toBe(28);
		expect(increment).not.toBeCalled();
		mockFnExpectations(catchFn, 1, 28, getError(input));
		expect(catchFn).toHaveBeenCalledTimes(1);
		expect(catchInCatchBlockFn).not.toBeCalled();
	});
	it("should work for reject in promise on input and promise in fallback", async () => {
		expect.assertions(6);
		const input = 7;
		const increment = incrementMock(jest, "increment");
		const catchFn = getMockFn(jest)(() => input * 4, "catchFn");
		const catchInCatchBlockFn = getMockFn(jest)(() => input * 17, "catchInCatchBlockFn");
		const result = await acatch(createAsyncPromise(catchFn))(createSyncPromise(increment, false)(input)).catch(
			catchInCatchBlockFn
		);
		expect(result).toBe(28);
		expect(increment).not.toBeCalled();
		mockFnExpectations(catchFn, 1, 28, getError(input));
		expect(catchFn).toHaveBeenCalledTimes(1);
		expect(catchInCatchBlockFn).not.toBeCalled();
	});
	it("should reject for rejection in fallback function", async () => {
		expect.assertions(6);
		const input = 7;
		const increment = incrementMock(jest, "increment");
		const catchFn = getMockFn(jest)(() => input * 4, "catchFn");
		const catchInCatchBlockFn = getMockFn(jest)(() => input * 17, "catchInCatchBlockFn");
		const result = await acatch(createAsyncPromise(catchFn, false))(
			createSyncPromise(increment, false)(input)
		).catch(catchInCatchBlockFn);
		expect(result).toBe(119);
		expect(increment).not.toBeCalled();
		expect(catchFn).not.toBeCalled();
		mockFnExpectations(catchInCatchBlockFn, 1, 119, getError(getError(input)));
		expect(catchInCatchBlockFn).toHaveBeenCalledTimes(1);
	});
});
