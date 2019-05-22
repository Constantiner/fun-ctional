import areduce from "../src/areduce";
import { createAsyncPromise, createSyncPromise } from "./test-utils/promiseUtils";
import {
	mockFnExpectations,
	identityMock,
	sumReduceFnMock,
	deductionReduceFnMock,
	concatenationReduceFnMock
} from "./test-utils/jestMockFns";
import { getErrorMessage } from "./test-utils/errorUtils";

describe("areduce tests", () => {
	it("should work for base case with synchronous data", async () => {
		expect.assertions(8);
		const sumFn = sumReduceFnMock(jest, "sumFn");
		const argument1 = 1;
		const argument2 = 2;
		const argument3 = 3;
		const argument4 = 2;
		const input = [argument1, argument2, argument3, argument4];

		const sum = await areduce(sumFn)(input);

		const expectedResult = 8;
		expect(sumFn).toHaveBeenCalledTimes(3);
		mockFnExpectations(sumFn, 1, 3, argument1, argument2, 1, input);
		mockFnExpectations(sumFn, 2, 6, 3, argument3, 2, input);
		mockFnExpectations(sumFn, 3, expectedResult, 6, argument4, 3, input);
		expect(sum).toBe(expectedResult);
	});
	it("should work for base case with synchronous data and with non symmetrical operation", async () => {
		expect.assertions(8);
		const deductionFn = deductionReduceFnMock(jest, "sumFn");
		const argument1 = 10;
		const argument2 = 2;
		const argument3 = 3;
		const argument4 = 2;
		const input = [argument1, argument2, argument3, argument4];

		const sum = await areduce(deductionFn)(input);

		const expectedResult = 3;
		expect(deductionFn).toHaveBeenCalledTimes(3);
		mockFnExpectations(deductionFn, 1, 8, argument1, argument2, 1, input);
		mockFnExpectations(deductionFn, 2, 5, 8, argument3, 2, input);
		mockFnExpectations(deductionFn, 3, expectedResult, 5, argument4, 3, input);
		expect(sum).toBe(expectedResult);
	});
	it("should work for base case with synchronous data and initial value", async () => {
		expect.assertions(8);
		const sumFn = sumReduceFnMock(jest, "sumFn");
		const argument1 = 1;
		const argument2 = 2;
		const argument3 = 3;
		const initialAcc = 7;
		const input = [argument1, argument2, argument3];

		const sum = await areduce(sumFn, initialAcc)(new Set(input));

		const expectedResult = 13;
		expect(sumFn).toHaveBeenCalledTimes(3);
		mockFnExpectations(sumFn, 1, 8, initialAcc, argument1, 0, input);
		mockFnExpectations(sumFn, 2, 10, 8, argument2, 1, input);
		mockFnExpectations(sumFn, 3, expectedResult, 10, argument3, 2, input);
		expect(sum).toBe(expectedResult);
	});
	it("should work for base case with synchronous data and initial value and with non symmetrical operation", async () => {
		expect.assertions(8);
		const concatenationFn = concatenationReduceFnMock(jest, "sumFn");
		const argument1 = 1;
		const argument2 = 2;
		const argument3 = 3;
		const initialAcc = 10;
		const input = [argument1, argument2, argument3];

		const result = await areduce(concatenationFn, initialAcc)(new Set(input));

		const expectedResult = "10123";
		expect(concatenationFn).toHaveBeenCalledTimes(3);
		mockFnExpectations(concatenationFn, 1, "101", initialAcc, argument1, 0, input);
		mockFnExpectations(concatenationFn, 2, "1012", "101", argument2, 1, input);
		mockFnExpectations(concatenationFn, 3, expectedResult, "1012", argument3, 2, input);
		expect(result).toBe(expectedResult);
	});
	it("should work for promise as input and with non symmetrical operation and initial value", async () => {
		expect.assertions(11);
		const concatenationFn = concatenationReduceFnMock(jest, "sumFn");
		const argument1 = 1;
		const argument2 = 2;
		const argument3 = 3;
		const initialAcc = 10;
		const identity = identityMock(jest, "identity");
		const inputValue = [argument1, argument2, argument3];
		const input = new Set(inputValue);

		const result = await areduce(concatenationFn, initialAcc)(createAsyncPromise(identity)(input));

		const expectedResult = "10123";
		expect(result).toBe(expectedResult);
		mockFnExpectations(identity, 1, input, input);
		expect(identity).toHaveBeenCalledTimes(1);
		expect(concatenationFn).toHaveBeenCalledTimes(3);
		mockFnExpectations(concatenationFn, 1, "101", initialAcc, argument1, 0, inputValue);
		mockFnExpectations(concatenationFn, 2, "1012", "101", argument2, 1, inputValue);
		mockFnExpectations(concatenationFn, 3, expectedResult, "1012", argument3, 2, inputValue);
	});
	it("should work for promise as input and with non symmetrical operation and without initial value", async () => {
		expect.assertions(11);
		const concatenationFn = concatenationReduceFnMock(jest, "sumFn");
		const argument1 = 10;
		const argument2 = 2;
		const argument3 = 3;
		const argument4 = 2;
		const identity = identityMock(jest, "identity");
		const input = [argument1, argument2, argument3, argument4];

		const result = await areduce(concatenationFn)(createAsyncPromise(identity)(input));

		const expectedResult = "10232";
		expect(result).toBe(expectedResult);
		mockFnExpectations(identity, 1, input, input);
		expect(identity).toHaveBeenCalledTimes(1);
		expect(concatenationFn).toHaveBeenCalledTimes(3);
		mockFnExpectations(concatenationFn, 1, "102", argument1, argument2, 1, input);
		mockFnExpectations(concatenationFn, 2, "1023", "102", argument3, 2, input);
		mockFnExpectations(concatenationFn, 3, expectedResult, "1023", argument4, 3, input);
	});
	it("should work with promise as input", async () => {
		expect.assertions(4);
		const input = new Set([1, 2, 3, 2]);
		const identity = identityMock(jest, "identity");

		const sum = await areduce((acc, value) => acc + value, 7)(createAsyncPromise(identity)(input));

		mockFnExpectations(identity, 1, input, input);
		expect(identity).toHaveBeenCalledTimes(1);
		expect(sum).toBe(13);
	});
	it("should reject with rejected promise as input", async () => {
		expect.assertions(3);
		const input = [1, 2, 3, 2];
		const identity = identityMock(jest, "identity");
		try {
			await areduce((acc, value) => acc + value, 7)(createAsyncPromise(identity, false)(input));
			expect(false).toBe(true);
		} catch (e) {
			expect(e).toBeInstanceOf(Error);
			expect(e.message).toBe(getErrorMessage(input));
			expect(identity).not.toHaveBeenCalled();
		}
	});
	it("should work for mixed list of promises and not as input and with non symmetrical operation and promised initial value", async () => {
		expect.assertions(17);
		const concatenationFn = concatenationReduceFnMock(jest, "sumFn");
		const identityArgument1 = identityMock(jest, "identityArgument1");
		const identityArgument3 = identityMock(jest, "identityArgument3");
		const identityAcc = identityMock(jest, "identityAcc");
		const argument1Value = 1;
		const argument1 = createAsyncPromise(identityArgument1)(argument1Value);
		const argument2 = 2;
		const argument3Value = 3;
		const argument3 = createSyncPromise(identityArgument3)(argument3Value);
		const initialAccValue = 10;
		const initialAcc = createAsyncPromise(identityAcc)(initialAccValue);
		const inputValue = [argument1, argument2, argument3];
		const inputValueResolved = [argument1Value, argument2, argument3Value];
		const input = new Set(inputValue);

		const result = await areduce(concatenationFn, initialAcc)(input);

		const expectedResult = "10123";
		expect(result).toBe(expectedResult);
		mockFnExpectations(identityArgument1, 1, argument1Value, argument1Value);
		expect(identityArgument1).toHaveBeenCalledTimes(1);
		mockFnExpectations(identityArgument3, 1, argument3Value, argument3Value);
		expect(identityArgument3).toHaveBeenCalledTimes(1);
		mockFnExpectations(identityAcc, 1, initialAccValue, initialAccValue);
		expect(identityAcc).toHaveBeenCalledTimes(1);
		expect(concatenationFn).toHaveBeenCalledTimes(3);
		mockFnExpectations(concatenationFn, 1, "101", initialAccValue, argument1Value, 0, inputValueResolved);
		mockFnExpectations(concatenationFn, 2, "1012", "101", argument2, 1, inputValueResolved);
		mockFnExpectations(concatenationFn, 3, expectedResult, "1012", argument3Value, 2, inputValueResolved);
	});
	it("should reject for mixed list of promises and not as input and with non symmetrical operation and promised initial value and fail in first input", async () => {
		expect.assertions(7);
		const concatenationFn = concatenationReduceFnMock(jest, "sumFn");
		const identityArgument1 = identityMock(jest, "identityArgument1");
		const identityArgument3 = identityMock(jest, "identityArgument3");
		const identityAcc = identityMock(jest, "identityAcc");
		const argument1Value = 1;
		const argument1 = createAsyncPromise(identityArgument1, false)(argument1Value);
		const argument2 = 2;
		const argument3Value = 3;
		const argument3 = createSyncPromise(identityArgument3)(argument3Value);
		const initialAccValue = 10;
		const initialAcc = createAsyncPromise(identityAcc, true, 50)(initialAccValue);
		const inputValue = [argument1, argument2, argument3];
		const input = new Set(inputValue);

		try {
			await areduce(concatenationFn, initialAcc)(input);
			expect(false).toBe(true);
		} catch (e) {
			expect(e).toBeInstanceOf(Error);
			expect(e.message).toBe(getErrorMessage(argument1Value));
			mockFnExpectations(identityAcc, 1, initialAccValue, initialAccValue);
			expect(identityAcc).toHaveBeenCalledTimes(1);
			expect(identityArgument1).not.toHaveBeenCalled();
			expect(concatenationFn).not.toHaveBeenCalled();
		}
	});
	it("should reject for mixed list of promises and not as input and with non symmetrical operation and promised initial value and fail in last input", async () => {
		expect.assertions(10);
		const concatenationFn = concatenationReduceFnMock(jest, "sumFn");
		const identityArgument1 = identityMock(jest, "identityArgument1");
		const identityArgument3 = identityMock(jest, "identityArgument3");
		const identityAcc = identityMock(jest, "identityAcc");
		const argument1Value = 1;
		const argument1 = createAsyncPromise(identityArgument1)(argument1Value);
		const argument2 = 2;
		const argument3Value = 3;
		const argument3 = createAsyncPromise(identityArgument3, false)(argument3Value);
		const initialAccValue = 10;
		const initialAcc = createAsyncPromise(identityAcc, true, 50)(initialAccValue);
		const input = new Set([argument1, argument2, argument3]);

		try {
			await areduce(concatenationFn, initialAcc)(input);
			expect(false).toBe(true);
		} catch (e) {
			expect(e).toBeInstanceOf(Error);
			expect(e.message).toBe(getErrorMessage(argument3Value));
			mockFnExpectations(identityArgument1, 1, argument1Value, argument1Value);
			expect(identityArgument1).toHaveBeenCalledTimes(1);
			mockFnExpectations(identityAcc, 1, initialAccValue, initialAccValue);
			expect(identityAcc).toHaveBeenCalledTimes(1);
			expect(concatenationFn).not.toHaveBeenCalled();
			expect(identityArgument3).not.toHaveBeenCalled();
		}
	});
	it("should work for mixed list of promises and not as input and with non symmetrical operation and promised initial value with promise in reduce function", async () => {
		expect.assertions(17);
		const concatenationFn = concatenationReduceFnMock(jest, "sumFn");
		const asyncConcatenationFn = createAsyncPromise(concatenationFn);
		const identityArgument1 = identityMock(jest, "identityArgument1");
		const identityArgument3 = identityMock(jest, "identityArgument3");
		const identityAcc = identityMock(jest, "identityAcc");
		const argument1Value = 1;
		const argument1 = createAsyncPromise(identityArgument1)(argument1Value);
		const argument2 = 2;
		const argument3Value = 3;
		const argument3 = createSyncPromise(identityArgument3)(argument3Value);
		const initialAccValue = 10;
		const initialAcc = createAsyncPromise(identityAcc)(initialAccValue);
		const inputValue = [argument1, argument2, argument3];
		const input = new Set(inputValue);
		const inputValueResolved = [argument1Value, argument2, argument3Value];

		const result = await areduce(asyncConcatenationFn, initialAcc)(input);

		const expectedResult = "10123";
		expect(result).toBe(expectedResult);
		mockFnExpectations(identityArgument1, 1, argument1Value, argument1Value);
		expect(identityArgument1).toHaveBeenCalledTimes(1);
		mockFnExpectations(identityArgument3, 1, argument3Value, argument3Value);
		expect(identityArgument3).toHaveBeenCalledTimes(1);
		mockFnExpectations(identityAcc, 1, initialAccValue, initialAccValue);
		expect(identityAcc).toHaveBeenCalledTimes(1);
		expect(concatenationFn).toHaveBeenCalledTimes(3);
		mockFnExpectations(concatenationFn, 1, "101", initialAccValue, argument1Value, 0, inputValueResolved);
		mockFnExpectations(concatenationFn, 2, "1012", "101", argument2, 1, inputValueResolved);
		mockFnExpectations(concatenationFn, 3, expectedResult, "1012", argument3Value, 2, inputValueResolved);
	});
	it("should work for mixed list of promises and not as input and with non symmetrical operation", async () => {
		expect.assertions(12);
		const concatenationFn = concatenationReduceFnMock(jest, "sumFn");
		const identityArgument1 = identityMock(jest, "identityArgument1");
		const identityArgument3 = identityMock(jest, "identityArgument3");
		const argument1Value = 1;
		const argument1 = createAsyncPromise(identityArgument1)(argument1Value);
		const argument2 = 2;
		const argument3Value = 3;
		const argument3 = createSyncPromise(identityArgument3)(argument3Value);
		const inputValue = [argument1, argument2, argument3];
		const input = new Set(inputValue);
		const inputValueResolved = [argument1Value, argument2, argument3Value];

		const result = await areduce(concatenationFn)(input);

		const expectedResult = "123";
		expect(result).toBe(expectedResult);
		mockFnExpectations(identityArgument1, 1, argument1Value, argument1Value);
		expect(identityArgument1).toHaveBeenCalledTimes(1);
		mockFnExpectations(identityArgument3, 1, argument3Value, argument3Value);
		expect(identityArgument3).toHaveBeenCalledTimes(1);
		expect(concatenationFn).toHaveBeenCalledTimes(2);
		mockFnExpectations(concatenationFn, 1, "12", argument1Value, argument2, 1, inputValueResolved);
		mockFnExpectations(concatenationFn, 2, expectedResult, "12", argument3Value, 2, inputValueResolved);
	});
	it("should work for mixed list of promises and not as input and with non symmetrical operation with promise in reduce function", async () => {
		expect.assertions(12);
		const concatenationFn = concatenationReduceFnMock(jest, "sumFn");
		const asyncConcatenationFn = createAsyncPromise(concatenationFn);
		const identityArgument1 = identityMock(jest, "identityArgument1");
		const identityArgument3 = identityMock(jest, "identityArgument3");
		const argument1Value = 1;
		const argument1 = createAsyncPromise(identityArgument1)(argument1Value);
		const argument2 = 2;
		const argument3Value = 3;
		const argument3 = createSyncPromise(identityArgument3)(argument3Value);
		const inputValue = [argument1, argument2, argument3];
		const input = new Set(inputValue);
		const inputValueResolved = [argument1Value, argument2, argument3Value];

		const result = await areduce(asyncConcatenationFn)(input);

		const expectedResult = "123";
		expect(result).toBe(expectedResult);
		mockFnExpectations(identityArgument1, 1, argument1Value, argument1Value);
		expect(identityArgument1).toHaveBeenCalledTimes(1);
		mockFnExpectations(identityArgument3, 1, argument3Value, argument3Value);
		expect(identityArgument3).toHaveBeenCalledTimes(1);
		expect(concatenationFn).toHaveBeenCalledTimes(2);
		mockFnExpectations(concatenationFn, 1, "12", argument1Value, argument2, 1, inputValueResolved);
		mockFnExpectations(concatenationFn, 2, expectedResult, "12", argument3Value, 2, inputValueResolved);
	});
});
