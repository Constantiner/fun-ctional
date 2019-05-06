import acompose from "../src/acompose";
import apipe from "../src/apipe";
import applySafe from "../src/applySafe";
import { getError } from "./test-utils/errorUtils";
import { getMockFn, incrementMock, mockFnExpectations, squareMock } from "./test-utils/jestMockFns";
import { createAsyncPromise, createSyncPromise } from "./test-utils/promiseUtils";

describe("applySafe tests", () => {
	it("should work for case without rejects", async () => {
		expect.assertions(6);
		const input = 7;
		const square = squareMock(jest, "square");
		const fallbackFn = getMockFn(jest)(() => input * 4, "fallbackFn");
		const catchFn = getMockFn(jest)(() => input * 17, "catchFn");
		const result = await applySafe(square, fallbackFn)(input).catch(catchFn);
		expect(result).toBe(49);
		mockFnExpectations(square, 1, 49, input);
		expect(square).toHaveBeenCalledTimes(1);
		expect(fallbackFn).not.toHaveBeenCalled();
		expect(catchFn).not.toHaveBeenCalled();
	});
	it("should work for case with promise on input", async () => {
		expect.assertions(9);
		const input = 7;
		const square = squareMock(jest, "square");
		const increment = incrementMock(jest, "increment");
		const fallbackFn = getMockFn(jest)(() => input * 4, "fallbackFn");
		const catchFn = getMockFn(jest)(() => input * 17, "catchFn");
		const result = await applySafe(square, fallbackFn)(createSyncPromise(increment)(input)).catch(catchFn);
		expect(result).toBe(64);
		mockFnExpectations(square, 1, 64, 8);
		expect(square).toHaveBeenCalledTimes(1);
		mockFnExpectations(increment, 1, 8, input);
		expect(increment).toHaveBeenCalledTimes(1);
		expect(fallbackFn).not.toHaveBeenCalled();
		expect(catchFn).not.toHaveBeenCalled();
	});
	it("should catch for case with rejected promise on input", async () => {
		expect.assertions(7);
		const input = 7;
		const square = squareMock(jest, "square");
		const increment = incrementMock(jest, "increment");
		const fallbackFn = getMockFn(jest)(() => input * 4, "fallbackFn");
		const catchFn = getMockFn(jest)(() => input * 17, "catchFn");
		const result = await applySafe(square, fallbackFn)(createAsyncPromise(increment, false)(input)).catch(catchFn);
		expect(result).toBe(28);
		expect(increment).not.toHaveBeenCalled();
		expect(square).not.toHaveBeenCalled();
		mockFnExpectations(fallbackFn, 1, 28, getError(input));
		expect(fallbackFn).toHaveBeenCalledTimes(1);
		expect(catchFn).not.toHaveBeenCalled();
	});
	it("should work for promises", async () => {
		expect.assertions(9);
		const input = 7;
		const square = squareMock(jest, "square");
		const increment = incrementMock(jest, "increment");
		const fallbackFn = getMockFn(jest)(() => input * 4, "fallbackFn");
		const catchFn = getMockFn(jest)(() => input * 17, "catchFn");
		const result = await applySafe(createAsyncPromise(square), fallbackFn)(
			createSyncPromise(increment)(input)
		).catch(catchFn);
		expect(result).toBe(64);
		mockFnExpectations(square, 1, 64, 8);
		expect(square).toHaveBeenCalledTimes(1);
		mockFnExpectations(increment, 1, 8, input);
		expect(increment).toHaveBeenCalledTimes(1);
		expect(fallbackFn).not.toHaveBeenCalled();
		expect(catchFn).not.toHaveBeenCalled();
	});
	it("should work for reject in promise in applySafe param", async () => {
		expect.assertions(9);
		const input = 7;
		const square = squareMock(jest, "square");
		const increment = incrementMock(jest, "increment");
		const fallbackFn = getMockFn(jest)(() => input * 4, "fallbackFn");
		const catchFn = getMockFn(jest)(() => input * 17, "catchFn");
		const result = await applySafe(createAsyncPromise(square, false), fallbackFn)(
			createSyncPromise(increment)(input)
		).catch(catchFn);
		expect(result).toBe(28);
		mockFnExpectations(increment, 1, 8, input);
		expect(increment).toHaveBeenCalledTimes(1);
		expect(square).not.toHaveBeenCalled();
		mockFnExpectations(fallbackFn, 1, 28, getError(8));
		expect(fallbackFn).toHaveBeenCalledTimes(1);
		expect(catchFn).not.toHaveBeenCalled();
	});
	it("should work for reject in promise in applySafe param and promise in fallback", async () => {
		expect.assertions(9);
		const input = 7;
		const square = squareMock(jest, "square");
		const increment = incrementMock(jest, "increment");
		const fallbackFn = getMockFn(jest)(() => input * 4, "fallbackFn");
		const catchFn = getMockFn(jest)(() => input * 17, "catchFn");
		const result = await applySafe(createAsyncPromise(square, false), createAsyncPromise(fallbackFn))(
			createSyncPromise(increment)(input)
		).catch(catchFn);
		expect(result).toBe(28);
		mockFnExpectations(increment, 1, 8, input);
		expect(increment).toHaveBeenCalledTimes(1);
		expect(square).not.toHaveBeenCalled();
		mockFnExpectations(fallbackFn, 1, 28, getError(8));
		expect(fallbackFn).toHaveBeenCalledTimes(1);
		expect(catchFn).not.toHaveBeenCalled();
	});
	it("should reject for rejection in fallback function", async () => {
		expect.assertions(9);
		const input = 7;
		const square = squareMock(jest, "square");
		const increment = incrementMock(jest, "increment");
		const fallbackFn = getMockFn(jest)(() => input * 4, "fallbackFn");
		const catchFn = getMockFn(jest)(() => input * 17, "catchFn");
		const result = await applySafe(createAsyncPromise(square, false), createAsyncPromise(fallbackFn, false))(
			createSyncPromise(increment)(input)
		).catch(catchFn);
		expect(result).toBe(119);
		mockFnExpectations(increment, 1, 8, input);
		expect(increment).toHaveBeenCalledTimes(1);
		expect(square).not.toHaveBeenCalled();
		expect(fallbackFn).not.toHaveBeenCalled();
		mockFnExpectations(catchFn, 1, 119, getError(getError(8)));
		expect(catchFn).toHaveBeenCalledTimes(1);
	});
});
describe("applySafe in acompose tests", () => {
	it("should work for case without rejects", async () => {
		expect.assertions(12);
		const input = 7;
		const increment1 = incrementMock(jest, "increment1");
		const increment2 = incrementMock(jest, "increment2");
		const increment3 = incrementMock(jest, "increment3");
		const catchFn = getMockFn(jest)(() => input * 4, "catchFn");
		const catchInCatchBlockFn = getMockFn(jest)(() => input * 17, "catchInCatchBlockFn");
		const result = await acompose(applySafe(increment3, catchFn), increment2, increment1)(input).catch(
			catchInCatchBlockFn
		);
		expect(result).toBe(10);
		expect(catchFn).not.toHaveBeenCalled();
		expect(catchInCatchBlockFn).not.toHaveBeenCalled();
		expect(increment1).toHaveBeenCalledTimes(1);
		mockFnExpectations(increment1, 1, 8, input);
		expect(increment2).toHaveBeenCalledTimes(1);
		mockFnExpectations(increment2, 1, 9, 8);
		expect(increment3).toHaveBeenCalledTimes(1);
		mockFnExpectations(increment3, 1, 10, 9);
	});
	it("should work for case with reject in acompose chain", async () => {
		expect.assertions(10);
		const input = 7;
		const increment1 = incrementMock(jest, "increment1");
		const increment2 = incrementMock(jest, "increment2");
		const increment3 = incrementMock(jest, "increment3");
		const increment2Promise = createAsyncPromise(increment2, false);
		const catchFn = getMockFn(jest)(() => input * 4, "catchFn");
		const catchInCatchBlockFn = getMockFn(jest)(() => input * 17, "catchInCatchBlockFn");
		const result = await acompose(applySafe(increment3, catchFn), increment2Promise, increment1)(input).catch(
			catchInCatchBlockFn
		);
		expect(result).toBe(28);
		expect(catchFn).toHaveBeenCalledTimes(1);
		mockFnExpectations(catchFn, 1, 28, getError(input + 1));
		expect(catchInCatchBlockFn).not.toHaveBeenCalled();
		expect(increment2).not.toHaveBeenCalled();
		expect(increment3).not.toHaveBeenCalled();
		expect(increment1).toHaveBeenCalledTimes(1);
		mockFnExpectations(increment1, 1, 8, input);
	});
	it("should work for case with reject in acompose chain for first argument", async () => {
		expect.assertions(8);
		const input = 7;
		const increment1 = incrementMock(jest, "increment1");
		const increment1Promise = createAsyncPromise(increment1, false);
		const increment2 = incrementMock(jest, "increment2");
		const increment3 = incrementMock(jest, "increment3");
		const catchFn = getMockFn(jest)(() => input * 4, "catchFn");
		const catchInCatchBlockFn = getMockFn(jest)(() => input * 17, "catchInCatchBlockFn");
		const result = await acompose(applySafe(increment3, catchFn), increment2, increment1Promise)(input).catch(
			catchInCatchBlockFn
		);
		expect(result).toBe(28);
		expect(catchFn).toHaveBeenCalledTimes(1);
		mockFnExpectations(catchFn, 1, 28, getError(input));
		expect(catchInCatchBlockFn).not.toHaveBeenCalled();
		expect(increment1).not.toHaveBeenCalled();
		expect(increment2).not.toHaveBeenCalled();
		expect(increment3).not.toHaveBeenCalled();
	});
	it("should work for case with reject in input", async () => {
		expect.assertions(8);
		const input = 7;
		const inputIncrement = incrementMock(jest, "inputIncrement");
		const inputIncrementPromise = createAsyncPromise(inputIncrement, false);
		const increment1 = incrementMock(jest, "increment1");
		const increment2 = incrementMock(jest, "increment2");
		const increment3 = incrementMock(jest, "increment3");
		const catchFn = getMockFn(jest)(() => input * 4, "catchFn");
		const catchInCatchBlockFn = getMockFn(jest)(() => input * 17, "catchInCatchBlockFn");
		const result = await acompose(applySafe(increment3, catchFn), increment2, increment1)(
			inputIncrementPromise(input)
		).catch(catchInCatchBlockFn);
		expect(result).toBe(28);
		expect(catchFn).toHaveBeenCalledTimes(1);
		mockFnExpectations(catchFn, 1, 28, getError(input));
		expect(increment1).not.toHaveBeenCalled();
		expect(increment2).not.toHaveBeenCalled();
		expect(increment3).not.toHaveBeenCalled();
		expect(catchInCatchBlockFn).not.toHaveBeenCalled();
	});
	it("should work for case with reject in acompose chain and applySafe in middle", async () => {
		expect.assertions(10);
		const input = 7;
		const increment1 = incrementMock(jest, "increment1");
		const increment1Promise = createAsyncPromise(increment1, false);
		const increment2 = incrementMock(jest, "increment2");
		const increment3 = incrementMock(jest, "increment3");
		const catchFn = getMockFn(jest)(() => input * 4, "catchFn");
		const catchInCatchBlockFn = getMockFn(jest)(() => input * 17, "catchInCatchBlockFn");
		const result = await acompose(increment2, applySafe(increment3, catchFn), increment1Promise)(input).catch(
			catchInCatchBlockFn
		);
		expect(result).toBe(29);
		expect(catchFn).toHaveBeenCalledTimes(1);
		mockFnExpectations(catchFn, 1, 28, getError(input));
		expect(catchInCatchBlockFn).not.toHaveBeenCalled();
		expect(increment1).not.toHaveBeenCalled();
		expect(increment2).toHaveBeenCalledTimes(1);
		mockFnExpectations(increment2, 1, 29, 28);
		expect(increment3).not.toHaveBeenCalled();
	});
	it("should work for case with rejection in applySafe", async () => {
		expect.assertions(12);
		const input = 7;
		const increment1 = incrementMock(jest, "increment1");
		const increment2 = incrementMock(jest, "increment2");
		const increment3 = incrementMock(jest, "increment3");
		const increment3Promise = createAsyncPromise(increment3, false);
		const catchFn = getMockFn(jest)(() => input * 4, "catchFn");
		const catchInCatchBlockFn = getMockFn(jest)(() => input * 17, "catchInCatchBlockFn");
		const result = await acompose(applySafe(increment3Promise, catchFn), increment2, increment1)(input).catch(
			catchInCatchBlockFn
		);
		expect(result).toBe(28);
		expect(catchInCatchBlockFn).not.toHaveBeenCalled();
		expect(increment1).toHaveBeenCalledTimes(1);
		mockFnExpectations(increment1, 1, 8, input);
		expect(increment2).toHaveBeenCalledTimes(1);
		mockFnExpectations(increment2, 1, 9, 8);
		expect(increment3).not.toHaveBeenCalled();
		expect(catchFn).toHaveBeenCalledTimes(1);
		mockFnExpectations(catchFn, 1, 28, getError(9));
	});
});
describe("applySafe in apipe tests", () => {
	it("should work for case without rejects", async () => {
		expect.assertions(12);
		const input = 7;
		const increment1 = incrementMock(jest, "increment1");
		const increment2 = incrementMock(jest, "increment2");
		const increment3 = incrementMock(jest, "increment3");
		const catchFn = getMockFn(jest)(() => input * 4, "catchFn");
		const catchInCatchBlockFn = getMockFn(jest)(() => input * 17, "catchInCatchBlockFn");
		const result = await apipe(increment1, increment2, applySafe(increment3, catchFn))(input).catch(
			catchInCatchBlockFn
		);
		expect(result).toBe(10);
		expect(catchFn).not.toHaveBeenCalled();
		expect(catchInCatchBlockFn).not.toHaveBeenCalled();
		expect(increment1).toHaveBeenCalledTimes(1);
		mockFnExpectations(increment1, 1, 8, input);
		expect(increment2).toHaveBeenCalledTimes(1);
		mockFnExpectations(increment2, 1, 9, 8);
		expect(increment3).toHaveBeenCalledTimes(1);
		mockFnExpectations(increment3, 1, 10, 9);
	});
	it("should work for case with reject in apipe chain", async () => {
		expect.assertions(10);
		const input = 7;
		const increment1 = incrementMock(jest, "increment1");
		const increment2 = incrementMock(jest, "increment2");
		const increment3 = incrementMock(jest, "increment3");
		const increment2Promise = createAsyncPromise(increment2, false);
		const catchFn = getMockFn(jest)(() => input * 4, "catchFn");
		const catchInCatchBlockFn = getMockFn(jest)(() => input * 17, "catchInCatchBlockFn");
		const result = await apipe(increment1, increment2Promise, applySafe(increment3, catchFn))(input).catch(
			catchInCatchBlockFn
		);
		expect(result).toBe(28);
		expect(catchFn).toHaveBeenCalledTimes(1);
		mockFnExpectations(catchFn, 1, 28, getError(input + 1));
		expect(catchInCatchBlockFn).not.toHaveBeenCalled();
		expect(increment2).not.toHaveBeenCalled();
		expect(increment3).not.toHaveBeenCalled();
		expect(increment1).toHaveBeenCalledTimes(1);
		mockFnExpectations(increment1, 1, 8, input);
	});
	it("should work for case with reject in apipe chain for first argument", async () => {
		expect.assertions(8);
		const input = 7;
		const increment1 = incrementMock(jest, "increment1");
		const increment1Promise = createAsyncPromise(increment1, false);
		const increment2 = incrementMock(jest, "increment2");
		const increment3 = incrementMock(jest, "increment3");
		const catchFn = getMockFn(jest)(() => input * 4, "catchFn");
		const catchInCatchBlockFn = getMockFn(jest)(() => input * 17, "catchInCatchBlockFn");
		const result = await apipe(increment1Promise, increment2, applySafe(increment3, catchFn))(input).catch(
			catchInCatchBlockFn
		);
		expect(result).toBe(28);
		expect(catchFn).toHaveBeenCalledTimes(1);
		mockFnExpectations(catchFn, 1, 28, getError(input));
		expect(catchInCatchBlockFn).not.toHaveBeenCalled();
		expect(increment1).not.toHaveBeenCalled();
		expect(increment2).not.toHaveBeenCalled();
		expect(increment3).not.toHaveBeenCalled();
	});
	it("should work for case with reject in input", async () => {
		expect.assertions(8);
		const input = 7;
		const inputIncrement = incrementMock(jest, "inputIncrement");
		const inputIncrementPromise = createAsyncPromise(inputIncrement, false);
		const increment1 = incrementMock(jest, "increment1");
		const increment2 = incrementMock(jest, "increment2");
		const increment3 = incrementMock(jest, "increment3");
		const catchFn = getMockFn(jest)(() => input * 4, "catchFn");
		const catchInCatchBlockFn = getMockFn(jest)(() => input * 17, "catchInCatchBlockFn");
		const result = await apipe(increment1, increment2, applySafe(increment3, catchFn))(
			inputIncrementPromise(input)
		).catch(catchInCatchBlockFn);
		expect(result).toBe(28);
		expect(catchFn).toHaveBeenCalledTimes(1);
		mockFnExpectations(catchFn, 1, 28, getError(input));
		expect(increment1).not.toHaveBeenCalled();
		expect(increment2).not.toHaveBeenCalled();
		expect(increment3).not.toHaveBeenCalled();
		expect(catchInCatchBlockFn).not.toHaveBeenCalled();
	});
	it("should work for case with reject in apipe chain and applySafe in middle", async () => {
		expect.assertions(10);
		const input = 7;
		const increment1 = incrementMock(jest, "increment1");
		const increment1Promise = createAsyncPromise(increment1, false);
		const increment2 = incrementMock(jest, "increment2");
		const increment3 = incrementMock(jest, "increment3");
		const catchFn = getMockFn(jest)(() => input * 4, "catchFn");
		const catchInCatchBlockFn = getMockFn(jest)(() => input * 17, "catchInCatchBlockFn");
		const result = await apipe(increment1Promise, applySafe(increment3, catchFn), increment2)(input).catch(
			catchInCatchBlockFn
		);
		expect(result).toBe(29);
		expect(catchFn).toHaveBeenCalledTimes(1);
		mockFnExpectations(catchFn, 1, 28, getError(input));
		expect(catchInCatchBlockFn).not.toHaveBeenCalled();
		expect(increment1).not.toHaveBeenCalled();
		expect(increment2).toHaveBeenCalledTimes(1);
		mockFnExpectations(increment2, 1, 29, 28);
		expect(increment3).not.toHaveBeenCalled();
	});
	it("should work for case with rejection in applySafe", async () => {
		expect.assertions(12);
		const input = 7;
		const increment1 = incrementMock(jest, "increment1");
		const increment2 = incrementMock(jest, "increment2");
		const increment3 = incrementMock(jest, "increment3");
		const increment3Promise = createAsyncPromise(increment3, false);
		const catchFn = getMockFn(jest)(() => input * 4, "catchFn");
		const catchInCatchBlockFn = getMockFn(jest)(() => input * 17, "catchInCatchBlockFn");
		const result = await apipe(increment1, increment2, applySafe(increment3Promise, catchFn))(input).catch(
			catchInCatchBlockFn
		);
		expect(result).toBe(28);
		expect(catchInCatchBlockFn).not.toHaveBeenCalled();
		expect(increment1).toHaveBeenCalledTimes(1);
		mockFnExpectations(increment1, 1, 8, input);
		expect(increment2).toHaveBeenCalledTimes(1);
		mockFnExpectations(increment2, 1, 9, 8);
		expect(increment3).not.toHaveBeenCalled();
		expect(catchFn).toHaveBeenCalledTimes(1);
		mockFnExpectations(catchFn, 1, 28, getError(9));
	});
});
