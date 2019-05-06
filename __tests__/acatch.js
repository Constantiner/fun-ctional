import acatch from "../src/acatch";
import acompose from "../src/acompose";
import apipe from "../src/apipe";
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
		expect(catchFn).not.toHaveBeenCalled();
		expect(catchInCatchBlockFn).not.toHaveBeenCalled();
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
		expect(catchFn).not.toHaveBeenCalled();
		expect(catchInCatchBlockFn).not.toHaveBeenCalled();
	});
	it("should catch for case with rejected promise on input", async () => {
		expect.assertions(6);
		const input = 7;
		const increment = incrementMock(jest, "increment");
		const catchFn = getMockFn(jest)(() => input * 4, "catchFn");
		const catchInCatchBlockFn = getMockFn(jest)(() => input * 17, "catchInCatchBlockFn");
		const result = await acatch(catchFn)(createAsyncPromise(increment, false)(input)).catch(catchInCatchBlockFn);
		expect(result).toBe(28);
		expect(increment).not.toHaveBeenCalled();
		mockFnExpectations(catchFn, 1, 28, getError(input));
		expect(catchFn).toHaveBeenCalledTimes(1);
		expect(catchInCatchBlockFn).not.toHaveBeenCalled();
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
		expect(increment).not.toHaveBeenCalled();
		mockFnExpectations(catchFn, 1, 28, getError(input));
		expect(catchFn).toHaveBeenCalledTimes(1);
		expect(catchInCatchBlockFn).not.toHaveBeenCalled();
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
		expect(increment).not.toHaveBeenCalled();
		expect(catchFn).not.toHaveBeenCalled();
		mockFnExpectations(catchInCatchBlockFn, 1, 119, getError(getError(input)));
		expect(catchInCatchBlockFn).toHaveBeenCalledTimes(1);
	});
});
describe("acatch in acompose tests", () => {
	it("should work for case without rejects", async () => {
		expect.assertions(3);
		const input = 7;
		const increment1 = incrementMock(jest, "increment1");
		const increment2 = incrementMock(jest, "increment2");
		const catchFn = getMockFn(jest)(() => input * 4, "catchFn");
		const catchInCatchBlockFn = getMockFn(jest)(() => input * 17, "catchInCatchBlockFn");
		const result = await acompose(acatch(catchFn), increment2, increment1)(input).catch(catchInCatchBlockFn);
		expect(result).toBe(9);
		expect(catchFn).not.toHaveBeenCalled();
		expect(catchInCatchBlockFn).not.toHaveBeenCalled();
	});
	it("should work for case with reject in acompose chain", async () => {
		expect.assertions(9);
		const input = 7;
		const increment1 = incrementMock(jest, "increment1");
		const increment2 = incrementMock(jest, "increment2");
		const increment2Promise = createAsyncPromise(increment2, false);
		const catchFn = getMockFn(jest)(() => input * 4, "catchFn");
		const catchInCatchBlockFn = getMockFn(jest)(() => input * 17, "catchInCatchBlockFn");
		const result = await acompose(acatch(catchFn), increment2Promise, increment1)(input).catch(catchInCatchBlockFn);
		expect(result).toBe(28);
		expect(catchFn).toHaveBeenCalledTimes(1);
		mockFnExpectations(catchFn, 1, 28, getError(input + 1));
		expect(catchInCatchBlockFn).not.toHaveBeenCalled();
		expect(increment2).not.toHaveBeenCalled();
		expect(increment1).toHaveBeenCalledTimes(1);
		mockFnExpectations(increment1, 1, 8, input);
	});
	it("should work for case with reject in acompose chain for first argument", async () => {
		expect.assertions(7);
		const input = 7;
		const increment1 = incrementMock(jest, "increment1");
		const increment1Promise = createAsyncPromise(increment1, false);
		const increment2 = incrementMock(jest, "increment2");
		const catchFn = getMockFn(jest)(() => input * 4, "catchFn");
		const catchInCatchBlockFn = getMockFn(jest)(() => input * 17, "catchInCatchBlockFn");
		const result = await acompose(acatch(catchFn), increment2, increment1Promise)(input).catch(catchInCatchBlockFn);
		expect(result).toBe(28);
		expect(catchFn).toHaveBeenCalledTimes(1);
		mockFnExpectations(catchFn, 1, 28, getError(input));
		expect(catchInCatchBlockFn).not.toHaveBeenCalled();
		expect(increment1).not.toHaveBeenCalled();
		expect(increment2).not.toHaveBeenCalled();
	});
	it("should work for case with reject in input", async () => {
		expect.assertions(7);
		const input = 7;
		const inputIncrement = incrementMock(jest, "inputIncrement");
		const inputIncrementPromise = createAsyncPromise(inputIncrement, false);
		const increment1 = incrementMock(jest, "increment1");
		const increment2 = incrementMock(jest, "increment2");
		const catchFn = getMockFn(jest)(() => input * 4, "catchFn");
		const catchInCatchBlockFn = getMockFn(jest)(() => input * 17, "catchInCatchBlockFn");
		const result = await acompose(acatch(catchFn), increment2, increment1)(inputIncrementPromise(input)).catch(
			catchInCatchBlockFn
		);
		expect(result).toBe(28);
		expect(catchFn).toHaveBeenCalledTimes(1);
		mockFnExpectations(catchFn, 1, 28, getError(input));
		expect(increment1).not.toHaveBeenCalled();
		expect(increment2).not.toHaveBeenCalled();
		expect(catchInCatchBlockFn).not.toHaveBeenCalled();
	});
	it("should work for case with reject in acompose chain and acatch in middle", async () => {
		expect.assertions(8);
		const input = 7;
		const increment1 = incrementMock(jest, "increment1");
		const increment1Promise = createAsyncPromise(increment1, false);
		const increment2 = incrementMock(jest, "increment2");
		const catchFn = getMockFn(jest)(() => input * 4, "catchFn");
		const catchInCatchBlockFn = getMockFn(jest)(() => input * 17, "catchInCatchBlockFn");
		const result = await acompose(increment2, acatch(catchFn), increment1Promise)(input).catch(catchInCatchBlockFn);
		expect(result).toBe(29);
		mockFnExpectations(catchFn, 1, 28, getError(input));
		expect(catchInCatchBlockFn).not.toHaveBeenCalled();
		expect(increment1).not.toHaveBeenCalled();
		expect(increment2).toHaveBeenCalledTimes(1);
		mockFnExpectations(increment2, 1, 29, 28);
	});
});
describe("acatch in apipe tests", () => {
	it("should work for case without rejects", async () => {
		expect.assertions(3);
		const input = 7;
		const increment1 = incrementMock(jest, "increment1");
		const increment2 = incrementMock(jest, "increment2");
		const catchFn = getMockFn(jest)(() => input * 4, "catchFn");
		const catchInCatchBlockFn = getMockFn(jest)(() => input * 17, "catchInCatchBlockFn");
		const result = await apipe(increment1, increment2, acatch(catchFn))(input).catch(catchInCatchBlockFn);
		expect(result).toBe(9);
		expect(catchFn).not.toHaveBeenCalled();
		expect(catchInCatchBlockFn).not.toHaveBeenCalled();
	});
	it("should work for case with reject in apipe chain", async () => {
		expect.assertions(9);
		const input = 7;
		const increment1 = incrementMock(jest, "increment1");
		const increment2 = incrementMock(jest, "increment2");
		const increment2Promise = createAsyncPromise(increment2, false);
		const catchFn = getMockFn(jest)(() => input * 4, "catchFn");
		const catchInCatchBlockFn = getMockFn(jest)(() => input * 17, "catchInCatchBlockFn");
		const result = await apipe(increment1, increment2Promise, acatch(catchFn))(input).catch(catchInCatchBlockFn);
		expect(result).toBe(28);
		expect(catchFn).toHaveBeenCalledTimes(1);
		mockFnExpectations(catchFn, 1, 28, getError(input + 1));
		expect(catchInCatchBlockFn).not.toHaveBeenCalled();
		expect(increment2).not.toHaveBeenCalled();
		expect(increment1).toHaveBeenCalledTimes(1);
		mockFnExpectations(increment1, 1, 8, input);
	});
	it("should work for case with reject in apipe chain for first argument", async () => {
		expect.assertions(7);
		const input = 7;
		const increment1 = incrementMock(jest, "increment1");
		const increment1Promise = createAsyncPromise(increment1, false);
		const increment2 = incrementMock(jest, "increment2");
		const catchFn = getMockFn(jest)(() => input * 4, "catchFn");
		const catchInCatchBlockFn = getMockFn(jest)(() => input * 17, "catchInCatchBlockFn");
		const result = await apipe(increment1Promise, increment2, acatch(catchFn))(input).catch(catchInCatchBlockFn);
		expect(result).toBe(28);
		expect(catchFn).toHaveBeenCalledTimes(1);
		mockFnExpectations(catchFn, 1, 28, getError(input));
		expect(catchInCatchBlockFn).not.toHaveBeenCalled();
		expect(increment1).not.toHaveBeenCalled();
		expect(increment2).not.toHaveBeenCalled();
	});
	it("should work for case with reject in input", async () => {
		expect.assertions(7);
		const input = 7;
		const inputIncrement = incrementMock(jest, "inputIncrement");
		const inputIncrementPromise = createAsyncPromise(inputIncrement, false);
		const increment1 = incrementMock(jest, "increment1");
		const increment2 = incrementMock(jest, "increment2");
		const catchFn = getMockFn(jest)(() => input * 4, "catchFn");
		const catchInCatchBlockFn = getMockFn(jest)(() => input * 17, "catchInCatchBlockFn");
		const result = await apipe(increment1, increment2, acatch(catchFn))(inputIncrementPromise(input)).catch(
			catchInCatchBlockFn
		);
		expect(result).toBe(28);
		expect(catchFn).toHaveBeenCalledTimes(1);
		mockFnExpectations(catchFn, 1, 28, getError(input));
		expect(increment1).not.toHaveBeenCalled();
		expect(increment2).not.toHaveBeenCalled();
		expect(catchInCatchBlockFn).not.toHaveBeenCalled();
	});
	it("should work for case with reject in apipe chain and acatch in middle", async () => {
		expect.assertions(8);
		const input = 7;
		const increment1 = incrementMock(jest, "increment1");
		const increment1Promise = createAsyncPromise(increment1, false);
		const increment2 = incrementMock(jest, "increment2");
		const catchFn = getMockFn(jest)(() => input * 4, "catchFn");
		const catchInCatchBlockFn = getMockFn(jest)(() => input * 17, "catchInCatchBlockFn");
		const result = await apipe(increment1Promise, acatch(catchFn), increment2)(input).catch(catchInCatchBlockFn);
		expect(result).toBe(29);
		mockFnExpectations(catchFn, 1, 28, getError(input));
		expect(catchInCatchBlockFn).not.toHaveBeenCalled();
		expect(increment1).not.toHaveBeenCalled();
		expect(increment2).toHaveBeenCalledTimes(1);
		mockFnExpectations(increment2, 1, 29, 28);
	});
});
