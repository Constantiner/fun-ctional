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
		const argument1 = 2;
		const argument2 = 3;
		const argument3 = 2;
		const argument4 = 1;

		const inputValue = [argument1, argument2, argument3, argument4];
		const sum = await areduceRight(sumFn)(inputValue);

		const expectedResult = 8;
		expect(sumFn).toHaveBeenCalledTimes(3);
		mockFnExpectations(sumFn, 1, 3, argument4, argument3, 2, inputValue);
		mockFnExpectations(sumFn, 2, 6, 3, argument2, 1, inputValue);
		mockFnExpectations(sumFn, 3, expectedResult, 6, argument1, 0, inputValue);
		expect(sum).toBe(expectedResult);
	});
	it("should work for base case with synchronous data and with non symmetrical operation", async () => {
		expect.assertions(8);
		const deductionFn = deductionReduceFnMock(jest, "deductionFn");
		const argument1 = 2;
		const argument2 = 3;
		const argument3 = 2;
		const argument4 = 10;

		const inputValue = [argument1, argument2, argument3, argument4];
		const sum = await areduceRight(deductionFn)(inputValue);

		const expectedResult = 3;
		expect(deductionFn).toHaveBeenCalledTimes(3);
		mockFnExpectations(deductionFn, 1, 8, argument4, argument3, 2, inputValue);
		mockFnExpectations(deductionFn, 2, 5, 8, argument2, 1, inputValue);
		mockFnExpectations(deductionFn, 3, expectedResult, 5, argument1, 0, inputValue);
		expect(sum).toBe(expectedResult);
	});
	it("should work for base case with synchronous data and initial value", async () => {
		expect.assertions(8);
		const sumFn = sumReduceFnMock(jest, "sumFn");
		const argument1 = 3;
		const argument2 = 2;
		const argument3 = 1;
		const initialAccumulator = 7;

		const inputValue = [argument1, argument2, argument3];
		const sum = await areduceRight(sumFn, initialAccumulator)(new Set(inputValue));

		const expectedResult = 13;
		expect(sumFn).toHaveBeenCalledTimes(3);
		mockFnExpectations(sumFn, 1, 8, initialAccumulator, argument3, 2, inputValue);
		mockFnExpectations(sumFn, 2, 10, 8, argument2, 1, inputValue);
		mockFnExpectations(sumFn, 3, expectedResult, 10, argument1, 0, inputValue);
		expect(sum).toBe(expectedResult);
	});
	it("should work for base case with synchronous data and initial value and with non symmetrical operation", async () => {
		expect.assertions(8);
		const concatenationFn = concatenationReduceFnMock(jest, "sumFn");
		const argument1 = 3;
		const argument2 = 2;
		const argument3 = 1;
		const initialAccumulator = 10;

		const inputValue = [argument1, argument2, argument3];
		const result = await areduceRight(concatenationFn, initialAccumulator)(new Set(inputValue));

		const expectedResult = "10123";
		expect(concatenationFn).toHaveBeenCalledTimes(3);
		mockFnExpectations(concatenationFn, 1, "101", initialAccumulator, argument3, 2, inputValue);
		mockFnExpectations(concatenationFn, 2, "1012", "101", argument2, 1, inputValue);
		mockFnExpectations(concatenationFn, 3, expectedResult, "1012", argument1, 0, inputValue);
		expect(result).toBe(expectedResult);
	});
	it("should work for promise as input and with non symmetrical operation and initial value", async () => {
		expect.assertions(11);
		const concatenationFn = concatenationReduceFnMock(jest, "sumFn");
		const argument1 = 3;
		const argument2 = 2;
		const argument3 = 1;
		const initialAccumulator = 10;
		const identity = identityMock(jest, "identity");
		const inputValue = [argument1, argument2, argument3];
		const input = new Set(inputValue);

		const result = await areduceRight(concatenationFn, initialAccumulator)(createAsyncPromise(identity)(input));

		const expectedResult = "10123";
		expect(result).toBe(expectedResult);
		mockFnExpectations(identity, 1, input, input);
		expect(identity).toHaveBeenCalledTimes(1);
		expect(concatenationFn).toHaveBeenCalledTimes(3);
		mockFnExpectations(concatenationFn, 1, "101", initialAccumulator, argument3, 2, inputValue);
		mockFnExpectations(concatenationFn, 2, "1012", "101", argument2, 1, inputValue);
		mockFnExpectations(concatenationFn, 3, expectedResult, "1012", argument1, 0, inputValue);
	});
	it("should work for promise as input and with non symmetrical operation and without initial value", async () => {
		expect.assertions(11);
		const concatenationFn = concatenationReduceFnMock(jest, "sumFn");
		const argument1 = 2;
		const argument2 = 3;
		const argument3 = 2;
		const argument4 = 10;
		const identity = identityMock(jest, "identity");
		const inputValue = [argument1, argument2, argument3, argument4];

		const result = await areduceRight(concatenationFn)(createAsyncPromise(identity)(inputValue));

		const expectedResult = "10232";
		expect(result).toBe(expectedResult);
		mockFnExpectations(identity, 1, inputValue, inputValue);
		expect(identity).toHaveBeenCalledTimes(1);
		expect(concatenationFn).toHaveBeenCalledTimes(3);
		mockFnExpectations(concatenationFn, 1, "102", argument4, argument3, 2, inputValue);
		mockFnExpectations(concatenationFn, 2, "1023", "102", argument2, 1, inputValue);
		mockFnExpectations(concatenationFn, 3, expectedResult, "1023", argument1, 0, inputValue);
	});
	it("should work with promise as input", async () => {
		expect.assertions(4);
		const input = new Set([1, 2, 3, 2]);
		const identity = identityMock(jest, "identity");

		const sum = await areduceRight((accumulator, value) => accumulator + value, 7)(
			createAsyncPromise(identity)(input)
		);

		mockFnExpectations(identity, 1, input, input);
		expect(identity).toHaveBeenCalledTimes(1);
		expect(sum).toBe(13);
	});
	it("should reject with rejected promise as input", async () => {
		expect.assertions(3);
		const input = [1, 2, 3, 2];
		const identity = identityMock(jest, "identity");
		try {
			await areduceRight((accumulator, value) => accumulator + value, 7)(
				createAsyncPromise(identity, false)(input)
			);
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
		const identityAccumulator = identityMock(jest, "identityAccumulator");
		const argument1Value = 3;
		const argument1 = createSyncPromise(identityArgument1)(argument1Value);
		const argument2 = 2;
		const argument3Value = 1;
		const argument3 = createAsyncPromise(identityArgument3)(argument3Value);
		const initialAccumulatorValue = 10;
		const initialAccumulator = createAsyncPromise(identityAccumulator)(initialAccumulatorValue);
		const inputValue = [argument1, argument2, argument3];
		const input = new Set(inputValue);
		const inputValueResolved = [argument1Value, argument2, argument3Value];

		const result = await areduceRight(concatenationFn, initialAccumulator)(input);

		const expectedResult = "10123";
		expect(result).toBe(expectedResult);
		mockFnExpectations(identityArgument3, 1, argument3Value, argument3Value);
		expect(identityArgument3).toHaveBeenCalledTimes(1);
		mockFnExpectations(identityArgument1, 1, argument1Value, argument1Value);
		expect(identityArgument1).toHaveBeenCalledTimes(1);
		mockFnExpectations(identityAccumulator, 1, initialAccumulatorValue, initialAccumulatorValue);
		expect(identityAccumulator).toHaveBeenCalledTimes(1);
		expect(concatenationFn).toHaveBeenCalledTimes(3);
		mockFnExpectations(concatenationFn, 1, "101", initialAccumulatorValue, argument3Value, 2, inputValueResolved);
		mockFnExpectations(concatenationFn, 2, "1012", "101", argument2, 1, inputValueResolved);
		mockFnExpectations(concatenationFn, 3, expectedResult, "1012", argument1Value, 0, inputValueResolved);
	});
	it("should reject for mixed list of promises and not as input and with non symmetrical operation and promised initial value and fail in first input", async () => {
		expect.assertions(7);
		const concatenationFn = concatenationReduceFnMock(jest, "sumFn");
		const identityArgument1 = identityMock(jest, "identityArgument1");
		const identityArgument3 = identityMock(jest, "identityArgument3");
		const identityAccumulator = identityMock(jest, "identityAccumulator");
		const initialAccumulatorValue = 10;
		const initialAccumulator = createAsyncPromise(identityAccumulator, true, 50)(initialAccumulatorValue);
		const argument1Value = 3;
		const argument1 = createSyncPromise(identityArgument1)(argument1Value);
		const argument2 = 2;
		const argument3Value = 1;
		const argument3 = createAsyncPromise(identityArgument3, false)(argument3Value);
		const input = new Set([argument1, argument2, argument3]);

		try {
			await areduceRight(concatenationFn, initialAccumulator)(input);
			expect(false).toBe(true);
		} catch (e) {
			expect(e).toBeInstanceOf(Error);
			expect(e.message).toBe(getErrorMessage(argument3Value));
			mockFnExpectations(identityAccumulator, 1, initialAccumulatorValue, initialAccumulatorValue);
			expect(identityAccumulator).toHaveBeenCalledTimes(1);
			expect(identityArgument3).not.toHaveBeenCalled();
			expect(concatenationFn).not.toHaveBeenCalled();
		}
	});
	it("should reject for mixed list of promises and not as input and with non symmetrical operation and promised initial value and fail in last input", async () => {
		expect.assertions(10);
		const concatenationFn = concatenationReduceFnMock(jest, "sumFn");
		const identityArgument1 = identityMock(jest, "identityArgument1");
		const identityArgument3 = identityMock(jest, "identityArgument3");
		const identityAccumulator = identityMock(jest, "identityAccumulator");
		const initialAccumulatorValue = 10;
		const initialAccumulator = createAsyncPromise(identityAccumulator, true, 50)(initialAccumulatorValue);
		const argument1Value = 3;
		const argument1 = createAsyncPromise(identityArgument1, false)(argument1Value);
		const argument2 = 2;
		const argument3Value = 1;
		const argument3 = createAsyncPromise(identityArgument3, true, 50)(argument3Value);
		const input = new Set([argument1, argument2, argument3]);

		try {
			await areduceRight(concatenationFn, initialAccumulator)(input);
			expect(false).toBe(true);
		} catch (e) {
			expect(e).toBeInstanceOf(Error);
			expect(e.message).toBe(getErrorMessage(argument1Value));
			mockFnExpectations(identityArgument3, 1, argument3Value, argument3Value);
			expect(identityArgument3).toHaveBeenCalledTimes(1);
			mockFnExpectations(identityAccumulator, 1, initialAccumulatorValue, initialAccumulatorValue);
			expect(identityAccumulator).toHaveBeenCalledTimes(1);
			expect(concatenationFn).not.toHaveBeenCalled();
			expect(identityArgument1).not.toHaveBeenCalled();
		}
	});
	it("should work for mixed list of promises and not as input and with non symmetrical operation and promised initial value with promise in reduce function", async () => {
		expect.assertions(17);
		const concatenationFn = concatenationReduceFnMock(jest, "sumFn");
		const asyncConcatenationFn = createAsyncPromise(concatenationFn);
		const identityArgument1 = identityMock(jest, "identityArgument1");
		const identityArgument3 = identityMock(jest, "identityArgument3");
		const identityAccumulator = identityMock(jest, "identityAccumulator");
		const argument1Value = 3;
		const argument1 = createSyncPromise(identityArgument1)(argument1Value);
		const argument2 = 2;
		const argument3Value = 1;
		const argument3 = createAsyncPromise(identityArgument3)(argument3Value);
		const initialAccumulatorValue = 10;
		const initialAccumulator = createAsyncPromise(identityAccumulator)(initialAccumulatorValue);
		const inputValue = [argument1, argument2, argument3];
		const input = new Set(inputValue);
		const inputValueResolved = [argument1Value, argument2, argument3Value];

		const result = await areduceRight(asyncConcatenationFn, initialAccumulator)(input);

		const expectedResult = "10123";
		expect(result).toBe(expectedResult);
		mockFnExpectations(identityArgument3, 1, argument3Value, argument3Value);
		expect(identityArgument3).toHaveBeenCalledTimes(1);
		mockFnExpectations(identityArgument1, 1, argument1Value, argument1Value);
		expect(identityArgument1).toHaveBeenCalledTimes(1);
		mockFnExpectations(identityAccumulator, 1, initialAccumulatorValue, initialAccumulatorValue);
		expect(identityAccumulator).toHaveBeenCalledTimes(1);
		expect(concatenationFn).toHaveBeenCalledTimes(3);
		mockFnExpectations(concatenationFn, 1, "101", initialAccumulatorValue, argument3Value, 2, inputValueResolved);
		mockFnExpectations(concatenationFn, 2, "1012", "101", argument2, 1, inputValueResolved);
		mockFnExpectations(concatenationFn, 3, expectedResult, "1012", argument1Value, 0, inputValueResolved);
	});
	it("should work for mixed list of promises and not as input and with non symmetrical operation", async () => {
		expect.assertions(12);
		const concatenationFn = concatenationReduceFnMock(jest, "sumFn");
		const identityArgument1 = identityMock(jest, "identityArgument1");
		const identityArgument3 = identityMock(jest, "identityArgument3");
		const argument1Value = 3;
		const argument1 = createSyncPromise(identityArgument1)(argument1Value);
		const argument2 = 2;
		const argument3Value = 1;
		const argument3 = createAsyncPromise(identityArgument3)(argument3Value);
		const inputValue = [argument1, argument2, argument3];
		const input = new Set(inputValue);
		const inputValueResolved = [argument1Value, argument2, argument3Value];

		const result = await areduceRight(concatenationFn)(input);

		const expectedResult = "123";
		expect(result).toBe(expectedResult);
		mockFnExpectations(identityArgument3, 1, argument3Value, argument3Value);
		expect(identityArgument3).toHaveBeenCalledTimes(1);
		mockFnExpectations(identityArgument1, 1, argument1Value, argument1Value);
		expect(identityArgument1).toHaveBeenCalledTimes(1);
		expect(concatenationFn).toHaveBeenCalledTimes(2);
		mockFnExpectations(concatenationFn, 1, "12", argument3Value, argument2, 1, inputValueResolved);
		mockFnExpectations(concatenationFn, 2, expectedResult, "12", argument1Value, 0, inputValueResolved);
	});
	it("should work for mixed list of promises and not as input and with non symmetrical operation with promise in reduce function", async () => {
		expect.assertions(12);
		const concatenationFn = concatenationReduceFnMock(jest, "sumFn");
		const asyncConcatenationFn = createAsyncPromise(concatenationFn);
		const identityArgument1 = identityMock(jest, "identityArgument1");
		const identityArgument3 = identityMock(jest, "identityArgument3");
		const argument1Value = 3;
		const argument1 = createSyncPromise(identityArgument1)(argument1Value);
		const argument2 = 2;
		const argument3Value = 1;
		const argument3 = createAsyncPromise(identityArgument3)(argument3Value);
		const inputValue = [argument1, argument2, argument3];
		const input = new Set(inputValue);
		const inputValueResolved = [argument1Value, argument2, argument3Value];

		const result = await areduceRight(asyncConcatenationFn)(input);

		const expectedResult = "123";
		expect(result).toBe(expectedResult);
		mockFnExpectations(identityArgument3, 1, argument3Value, argument3Value);
		expect(identityArgument3).toHaveBeenCalledTimes(1);
		mockFnExpectations(identityArgument1, 1, argument1Value, argument1Value);
		expect(identityArgument1).toHaveBeenCalledTimes(1);
		expect(concatenationFn).toHaveBeenCalledTimes(2);
		mockFnExpectations(concatenationFn, 1, "12", argument3Value, argument2, 1, inputValueResolved);
		mockFnExpectations(concatenationFn, 2, expectedResult, "12", argument1Value, 0, inputValueResolved);
	});
});
