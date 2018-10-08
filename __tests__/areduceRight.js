import areduceRight from "../src/areduceRight";
import { createAsyncPromise, createSyncPromise } from "./test-utils/promiseUtils";
import {
	mockFnExpectations,
	identityMock,
	sumReduceFnMock,
	deductionReduceFnMock,
	concatenationReduceFnMock
} from "./test-utils/jestMockFns";
import { getErrorMessage } from "./test-utils/errorUtils";

describe("areduceRight tests", () => {
	it("should work for base case with synchronous data", async () => {
		expect.assertions(8);
		const sumFn = sumReduceFnMock(jest, "sumFn");
		const arg1 = 2;
		const arg2 = 3;
		const arg3 = 2;
		const arg4 = 1;

		const inputValue = [arg1, arg2, arg3, arg4];
		const sum = await areduceRight(sumFn)(inputValue);

		const expectedResult = 8;
		expect(sumFn).toHaveBeenCalledTimes(3);
		mockFnExpectations(sumFn, 1, 3, arg4, arg3, 2, inputValue);
		mockFnExpectations(sumFn, 2, 6, 3, arg2, 1, inputValue);
		mockFnExpectations(sumFn, 3, expectedResult, 6, arg1, 0, inputValue);
		expect(sum).toBe(expectedResult);
	});
	it("should work for base case with synchronous data and with non symmetrical operation", async () => {
		expect.assertions(8);
		const deductionFn = deductionReduceFnMock(jest, "deductionFn");
		const arg1 = 2;
		const arg2 = 3;
		const arg3 = 2;
		const arg4 = 10;

		const inputValue = [arg1, arg2, arg3, arg4];
		const sum = await areduceRight(deductionFn)(inputValue);

		const expectedResult = 3;
		expect(deductionFn).toHaveBeenCalledTimes(3);
		mockFnExpectations(deductionFn, 1, 8, arg4, arg3, 2, inputValue);
		mockFnExpectations(deductionFn, 2, 5, 8, arg2, 1, inputValue);
		mockFnExpectations(deductionFn, 3, expectedResult, 5, arg1, 0, inputValue);
		expect(sum).toBe(expectedResult);
	});
	it("should work for base case with synchronous data and initial value", async () => {
		expect.assertions(8);
		const sumFn = sumReduceFnMock(jest, "sumFn");
		const arg1 = 3;
		const arg2 = 2;
		const arg3 = 1;
		const initialAcc = 7;

		const inputValue = [arg1, arg2, arg3];
		const sum = await areduceRight(sumFn, initialAcc)(new Set(inputValue));

		const expectedResult = 13;
		expect(sumFn).toHaveBeenCalledTimes(3);
		mockFnExpectations(sumFn, 1, 8, initialAcc, arg3, 2, inputValue);
		mockFnExpectations(sumFn, 2, 10, 8, arg2, 1, inputValue);
		mockFnExpectations(sumFn, 3, expectedResult, 10, arg1, 0, inputValue);
		expect(sum).toBe(expectedResult);
	});
	it("should work for base case with synchronous data and initial value and with non symmetrical operation", async () => {
		expect.assertions(8);
		const concatenationFn = concatenationReduceFnMock(jest, "sumFn");
		const arg1 = 3;
		const arg2 = 2;
		const arg3 = 1;
		const initialAcc = 10;

		const inputValue = [arg1, arg2, arg3];
		const result = await areduceRight(concatenationFn, initialAcc)(new Set(inputValue));

		const expectedResult = "10123";
		expect(concatenationFn).toHaveBeenCalledTimes(3);
		mockFnExpectations(concatenationFn, 1, "101", initialAcc, arg3, 2, inputValue);
		mockFnExpectations(concatenationFn, 2, "1012", "101", arg2, 1, inputValue);
		mockFnExpectations(concatenationFn, 3, expectedResult, "1012", arg1, 0, inputValue);
		expect(result).toBe(expectedResult);
	});
	it("should work for promise as input and with non symmetrical operation and initial value", async () => {
		expect.assertions(11);
		const concatenationFn = concatenationReduceFnMock(jest, "sumFn");
		const arg1 = 3;
		const arg2 = 2;
		const arg3 = 1;
		const initialAcc = 10;
		const identity = identityMock(jest, "identity");
		const inputValue = [arg1, arg2, arg3];
		const input = new Set(inputValue);

		const result = await areduceRight(concatenationFn, initialAcc)(createAsyncPromise(identity)(input));

		const expectedResult = "10123";
		expect(result).toBe(expectedResult);
		mockFnExpectations(identity, 1, input, input);
		expect(identity).toHaveBeenCalledTimes(1);
		expect(concatenationFn).toHaveBeenCalledTimes(3);
		mockFnExpectations(concatenationFn, 1, "101", initialAcc, arg3, 2, inputValue);
		mockFnExpectations(concatenationFn, 2, "1012", "101", arg2, 1, inputValue);
		mockFnExpectations(concatenationFn, 3, expectedResult, "1012", arg1, 0, inputValue);
	});
	it("should work for promise as input and with non symmetrical operation and without initial value", async () => {
		expect.assertions(11);
		const concatenationFn = concatenationReduceFnMock(jest, "sumFn");
		const arg1 = 2;
		const arg2 = 3;
		const arg3 = 2;
		const arg4 = 10;
		const identity = identityMock(jest, "identity");
		const inputValue = [arg1, arg2, arg3, arg4];

		const result = await areduceRight(concatenationFn)(createAsyncPromise(identity)(inputValue));

		const expectedResult = "10232";
		expect(result).toBe(expectedResult);
		mockFnExpectations(identity, 1, inputValue, inputValue);
		expect(identity).toHaveBeenCalledTimes(1);
		expect(concatenationFn).toHaveBeenCalledTimes(3);
		mockFnExpectations(concatenationFn, 1, "102", arg4, arg3, 2, inputValue);
		mockFnExpectations(concatenationFn, 2, "1023", "102", arg2, 1, inputValue);
		mockFnExpectations(concatenationFn, 3, expectedResult, "1023", arg1, 0, inputValue);
	});
	it("should work with promise as input", async () => {
		expect.assertions(4);
		const input = new Set([1, 2, 3, 2]);
		const identity = identityMock(jest, "identity");

		const sum = await areduceRight((acc, value) => acc + value, 7)(createAsyncPromise(identity)(input));

		mockFnExpectations(identity, 1, input, input);
		expect(identity).toHaveBeenCalledTimes(1);
		expect(sum).toBe(13);
	});
	it("should reject with rejected promise as input", async () => {
		expect.assertions(3);
		const input = [1, 2, 3, 2];
		const identity = identityMock(jest, "identity");
		try {
			await areduceRight((acc, value) => acc + value, 7)(createAsyncPromise(identity, false)(input));
			expect(false).toBe(true);
		} catch (e) {
			expect(e).toBeInstanceOf(Error);
			expect(e.message).toBe(getErrorMessage(input));
			expect(identity).not.toBeCalled();
		}
	});
	it("should work for mixed list of promises and not as input and with non symmetrical operation and promised initial value", async () => {
		expect.assertions(17);
		const concatenationFn = concatenationReduceFnMock(jest, "sumFn");
		const identityArg1 = identityMock(jest, "identityArg1");
		const identityArg3 = identityMock(jest, "identityArg3");
		const identityAcc = identityMock(jest, "identityAcc");
		const arg1Value = 3;
		const arg1 = createSyncPromise(identityArg1)(arg1Value);
		const arg2 = 2;
		const arg3Value = 1;
		const arg3 = createAsyncPromise(identityArg3)(arg3Value);
		const initialAccValue = 10;
		const initialAcc = createAsyncPromise(identityAcc)(initialAccValue);
		const inputValue = [arg1, arg2, arg3];
		const input = new Set(inputValue);
		const inputValueResolved = [arg1Value, arg2, arg3Value];

		const result = await areduceRight(concatenationFn, initialAcc)(input);

		const expectedResult = "10123";
		expect(result).toBe(expectedResult);
		mockFnExpectations(identityArg3, 1, arg3Value, arg3Value);
		expect(identityArg3).toHaveBeenCalledTimes(1);
		mockFnExpectations(identityArg1, 1, arg1Value, arg1Value);
		expect(identityArg1).toHaveBeenCalledTimes(1);
		mockFnExpectations(identityAcc, 1, initialAccValue, initialAccValue);
		expect(identityAcc).toHaveBeenCalledTimes(1);
		expect(concatenationFn).toHaveBeenCalledTimes(3);
		mockFnExpectations(concatenationFn, 1, "101", initialAccValue, arg3Value, 2, inputValueResolved);
		mockFnExpectations(concatenationFn, 2, "1012", "101", arg2, 1, inputValueResolved);
		mockFnExpectations(concatenationFn, 3, expectedResult, "1012", arg1Value, 0, inputValueResolved);
	});
	it("should reject for mixed list of promises and not as input and with non symmetrical operation and promised initial value and fail in first input", async () => {
		expect.assertions(7);
		const concatenationFn = concatenationReduceFnMock(jest, "sumFn");
		const identityArg1 = identityMock(jest, "identityArg1");
		const identityArg3 = identityMock(jest, "identityArg3");
		const identityAcc = identityMock(jest, "identityAcc");
		const arg1Value = 3;
		const arg1 = createSyncPromise(identityArg1)(arg1Value);
		const arg2 = 2;
		const arg3Value = 1;
		const arg3 = createAsyncPromise(identityArg3, false)(arg3Value);
		const initialAccValue = 10;
		const initialAcc = createAsyncPromise(identityAcc)(initialAccValue);
		const input = new Set([arg1, arg2, arg3]);

		try {
			await areduceRight(concatenationFn, initialAcc)(input);
			expect(false).toBe(true);
		} catch (e) {
			expect(e).toBeInstanceOf(Error);
			expect(e.message).toBe(getErrorMessage(arg3Value));
			mockFnExpectations(identityAcc, 1, initialAccValue, initialAccValue);
			expect(identityAcc).toHaveBeenCalledTimes(1);
			expect(identityArg3).not.toBeCalled();
			expect(concatenationFn).not.toBeCalled();
		}
	});
	it("should reject for mixed list of promises and not as input and with non symmetrical operation and promised initial value and fail in last input", async () => {
		expect.assertions(10);
		const concatenationFn = concatenationReduceFnMock(jest, "sumFn");
		const identityArg1 = identityMock(jest, "identityArg1");
		const identityArg3 = identityMock(jest, "identityArg3");
		const identityAcc = identityMock(jest, "identityAcc");
		const arg1Value = 3;
		const arg1 = createAsyncPromise(identityArg1, false)(arg1Value);
		const arg2 = 2;
		const arg3Value = 1;
		const arg3 = createAsyncPromise(identityArg3)(arg3Value);
		const initialAccValue = 10;
		const initialAcc = createAsyncPromise(identityAcc)(initialAccValue);
		const input = new Set([arg1, arg2, arg3]);

		try {
			await areduceRight(concatenationFn, initialAcc)(input);
			expect(false).toBe(true);
		} catch (e) {
			expect(e).toBeInstanceOf(Error);
			expect(e.message).toBe(getErrorMessage(arg1Value));
			mockFnExpectations(identityArg3, 1, arg3Value, arg3Value);
			expect(identityArg3).toHaveBeenCalledTimes(1);
			mockFnExpectations(identityAcc, 1, initialAccValue, initialAccValue);
			expect(identityAcc).toHaveBeenCalledTimes(1);
			expect(concatenationFn).not.toBeCalled();
			expect(identityArg1).not.toBeCalled();
		}
	});
	it("should work for mixed list of promises and not as input and with non symmetrical operation and promised initial value with promise in reduce function", async () => {
		expect.assertions(17);
		const concatenationFn = concatenationReduceFnMock(jest, "sumFn");
		const asyncConcatenationFn = createAsyncPromise(concatenationFn);
		const identityArg1 = identityMock(jest, "identityArg1");
		const identityArg3 = identityMock(jest, "identityArg3");
		const identityAcc = identityMock(jest, "identityAcc");
		const arg1Value = 3;
		const arg1 = createSyncPromise(identityArg1)(arg1Value);
		const arg2 = 2;
		const arg3Value = 1;
		const arg3 = createAsyncPromise(identityArg3)(arg3Value);
		const initialAccValue = 10;
		const initialAcc = createAsyncPromise(identityAcc)(initialAccValue);
		const inputValue = [arg1, arg2, arg3];
		const input = new Set(inputValue);
		const inputValueResolved = [arg1Value, arg2, arg3Value];

		const result = await areduceRight(asyncConcatenationFn, initialAcc)(input);

		const expectedResult = "10123";
		expect(result).toBe(expectedResult);
		mockFnExpectations(identityArg3, 1, arg3Value, arg3Value);
		expect(identityArg3).toHaveBeenCalledTimes(1);
		mockFnExpectations(identityArg1, 1, arg1Value, arg1Value);
		expect(identityArg1).toHaveBeenCalledTimes(1);
		mockFnExpectations(identityAcc, 1, initialAccValue, initialAccValue);
		expect(identityAcc).toHaveBeenCalledTimes(1);
		expect(concatenationFn).toHaveBeenCalledTimes(3);
		mockFnExpectations(concatenationFn, 1, "101", initialAccValue, arg3Value, 2, inputValueResolved);
		mockFnExpectations(concatenationFn, 2, "1012", "101", arg2, 1, inputValueResolved);
		mockFnExpectations(concatenationFn, 3, expectedResult, "1012", arg1Value, 0, inputValueResolved);
	});
	it("should work for mixed list of promises and not as input and with non symmetrical operation", async () => {
		expect.assertions(12);
		const concatenationFn = concatenationReduceFnMock(jest, "sumFn");
		const identityArg1 = identityMock(jest, "identityArg1");
		const identityArg3 = identityMock(jest, "identityArg3");
		const arg1Value = 3;
		const arg1 = createSyncPromise(identityArg1)(arg1Value);
		const arg2 = 2;
		const arg3Value = 1;
		const arg3 = createAsyncPromise(identityArg3)(arg3Value);
		const inputValue = [arg1, arg2, arg3];
		const input = new Set(inputValue);
		const inputValueResolved = [arg1Value, arg2, arg3Value];

		const result = await areduceRight(concatenationFn)(input);

		const expectedResult = "123";
		expect(result).toBe(expectedResult);
		mockFnExpectations(identityArg3, 1, arg3Value, arg3Value);
		expect(identityArg3).toHaveBeenCalledTimes(1);
		mockFnExpectations(identityArg1, 1, arg1Value, arg1Value);
		expect(identityArg1).toHaveBeenCalledTimes(1);
		expect(concatenationFn).toHaveBeenCalledTimes(2);
		mockFnExpectations(concatenationFn, 1, "12", arg3Value, arg2, 1, inputValueResolved);
		mockFnExpectations(concatenationFn, 2, expectedResult, "12", arg1Value, 0, inputValueResolved);
	});
	it("should work for mixed list of promises and not as input and with non symmetrical operation with promise in reduce function", async () => {
		expect.assertions(12);
		const concatenationFn = concatenationReduceFnMock(jest, "sumFn");
		const asyncConcatenationFn = createAsyncPromise(concatenationFn);
		const identityArg1 = identityMock(jest, "identityArg1");
		const identityArg3 = identityMock(jest, "identityArg3");
		const arg1Value = 3;
		const arg1 = createSyncPromise(identityArg1)(arg1Value);
		const arg2 = 2;
		const arg3Value = 1;
		const arg3 = createAsyncPromise(identityArg3)(arg3Value);
		const inputValue = [arg1, arg2, arg3];
		const input = new Set(inputValue);
		const inputValueResolved = [arg1Value, arg2, arg3Value];

		const result = await areduceRight(asyncConcatenationFn)(input);

		const expectedResult = "123";
		expect(result).toBe(expectedResult);
		mockFnExpectations(identityArg3, 1, arg3Value, arg3Value);
		expect(identityArg3).toHaveBeenCalledTimes(1);
		mockFnExpectations(identityArg1, 1, arg1Value, arg1Value);
		expect(identityArg1).toHaveBeenCalledTimes(1);
		expect(concatenationFn).toHaveBeenCalledTimes(2);
		mockFnExpectations(concatenationFn, 1, "12", arg3Value, arg2, 1, inputValueResolved);
		mockFnExpectations(concatenationFn, 2, expectedResult, "12", arg1Value, 0, inputValueResolved);
	});
});
