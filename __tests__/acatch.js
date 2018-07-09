import acatch from "../src/acatch";
import { getError } from "./test-utils/errorUtils";
import { getMockFn, incrementMock, mockFnExpectations, squareMock } from "./test-utils/jestMockFns";
import { createAsyncPromise, createSyncPromise } from "./test-utils/promiseUtils";

describe("acatch tests", () => {
	it("should work for case without rejects", async () => {
		expect.assertions(6);
		const input = 7;
		const square = squareMock(jest, "square");
		const failbackFn = getMockFn(jest)(() => input * 4, "failbackFn");
		const catchFn = getMockFn(jest)(() => input * 17, "catchFn");
		const result = await acatch(square, failbackFn)(input).catch(catchFn);
		expect(result).toBe(49);
		mockFnExpectations(square, 1, 49, input);
		expect(square).toHaveBeenCalledTimes(1);
		expect(failbackFn).not.toBeCalled();
		expect(catchFn).not.toBeCalled();
	});
	it("should work for case with promise on input", async () => {
		expect.assertions(9);
		const input = 7;
		const square = squareMock(jest, "square");
		const increment = incrementMock(jest, "increment");
		const failbackFn = getMockFn(jest)(() => input * 4, "failbackFn");
		const catchFn = getMockFn(jest)(() => input * 17, "catchFn");
		const result = await acatch(square, failbackFn)(createSyncPromise(increment)(input)).catch(catchFn);
		expect(result).toBe(64);
		mockFnExpectations(square, 1, 64, 8);
		expect(square).toHaveBeenCalledTimes(1);
		mockFnExpectations(increment, 1, 8, input);
		expect(increment).toHaveBeenCalledTimes(1);
		expect(failbackFn).not.toBeCalled();
		expect(catchFn).not.toBeCalled();
	});
	it("should catch for case with rejected promise on input", async () => {
		expect.assertions(7);
		const input = 7;
		const square = squareMock(jest, "square");
		const increment = incrementMock(jest, "increment");
		const failbackFn = getMockFn(jest)(() => input * 4, "failbackFn");
		const catchFn = getMockFn(jest)(() => input * 17, "catchFn");
		const result = await acatch(square, failbackFn)(createAsyncPromise(increment, false)(input)).catch(catchFn);
		expect(result).toBe(28);
		expect(increment).not.toBeCalled();
		expect(square).not.toBeCalled();
		mockFnExpectations(failbackFn, 1, 28, getError(input));
		expect(failbackFn).toHaveBeenCalledTimes(1);
		expect(catchFn).not.toBeCalled();
	});
	it("should work for promises", async () => {
		expect.assertions(9);
		const input = 7;
		const square = squareMock(jest, "square");
		const increment = incrementMock(jest, "increment");
		const failbackFn = getMockFn(jest)(() => input * 4, "failbackFn");
		const catchFn = getMockFn(jest)(() => input * 17, "catchFn");
		const result = await acatch(createAsyncPromise(square), failbackFn)(createSyncPromise(increment)(input)).catch(
			catchFn
		);
		expect(result).toBe(64);
		mockFnExpectations(square, 1, 64, 8);
		expect(square).toHaveBeenCalledTimes(1);
		mockFnExpectations(increment, 1, 8, input);
		expect(increment).toHaveBeenCalledTimes(1);
		expect(failbackFn).not.toBeCalled();
		expect(catchFn).not.toBeCalled();
	});
	it("should work for reject in promise in acatch param", async () => {
		expect.assertions(8);
		const input = 7;
		const square = squareMock(jest, "square");
		const increment = incrementMock(jest, "increment");
		const failbackFn = getMockFn(jest)(() => input * 4, "failbackFn");
		const catchFn = getMockFn(jest)(() => input * 17, "catchFn");
		const result = await acatch(createAsyncPromise(square, false), failbackFn)(
			createSyncPromise(increment)(input)
		).catch(catchFn);
		expect(result).toBe(28);
		mockFnExpectations(increment, 1, 8, input);
		expect(increment).toHaveBeenCalledTimes(1);
		expect(square).not.toBeCalled();
		mockFnExpectations(failbackFn, 1, 28, getError(8));
		expect(catchFn).not.toBeCalled();
	});
	it("should work for reject in promise in acatch param and promise in failback", async () => {
		expect.assertions(8);
		const input = 7;
		const square = squareMock(jest, "square");
		const increment = incrementMock(jest, "increment");
		const failbackFn = getMockFn(jest)(() => input * 4, "failbackFn");
		const catchFn = getMockFn(jest)(() => input * 17, "catchFn");
		const result = await acatch(createAsyncPromise(square, false), createAsyncPromise(failbackFn))(
			createSyncPromise(increment)(input)
		).catch(catchFn);
		expect(result).toBe(28);
		mockFnExpectations(increment, 1, 8, input);
		expect(increment).toHaveBeenCalledTimes(1);
		expect(square).not.toBeCalled();
		mockFnExpectations(failbackFn, 1, 28, getError(8));
		expect(catchFn).not.toBeCalled();
	});
	it("should reject for rejection in failback function", async () => {
		expect.assertions(9);
		const input = 7;
		const square = squareMock(jest, "square");
		const increment = incrementMock(jest, "increment");
		const failbackFn = getMockFn(jest)(() => input * 4, "failbackFn");
		const catchFn = getMockFn(jest)(() => input * 17, "catchFn");
		const result = await acatch(createAsyncPromise(square, false), createAsyncPromise(failbackFn, false))(
			createSyncPromise(increment)(input)
		).catch(catchFn);
		expect(result).toBe(119);
		mockFnExpectations(increment, 1, 8, input);
		expect(increment).toHaveBeenCalledTimes(1);
		expect(square).not.toBeCalled();
		expect(failbackFn).not.toBeCalled();
		mockFnExpectations(catchFn, 1, 119, getError(getError(8)));
		expect(catchFn).toHaveBeenCalledTimes(1);
	});
});
