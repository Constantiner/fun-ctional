import applyFns from "../src/applyFns";
import { getErrorMessage } from "./test-utils/errorUtils";
import {
	concatenateTestStringMock,
	getMockFn,
	incrementMock,
	mockFnExpectations,
	squareMock
} from "./test-utils/jestMockFns";
import { createAsyncPromise, createSyncPromise } from "./test-utils/promiseUtils";

describe("A kind of composable Promise.all with single input value for all handlers", () => {
	it("should work for functions without promises as parameters", async () => {
		expect.assertions(7);
		const square = squareMock(jest);
		const increment = incrementMock(jest);
		const concatenateTestString = concatenateTestStringMock(jest);
		const inputValue = 5;
		const result = await applyFns(square, increment, concatenateTestString)(inputValue);
		expect(result).toEqual([25, 6, "5test"]);
		mockFnExpectations(square, 1, 25, inputValue);
		mockFnExpectations(increment, 1, 6, inputValue);
		mockFnExpectations(concatenateTestString, 1, "5test", inputValue);
	});
	it("should work without arguments", async () => {
		expect.assertions(1);
		const inputValue = 5;
		const result = await applyFns()(inputValue);
		expect(result).toEqual([]);
	});
	it("should return a promise without arguments", () => {
		expect.assertions(2);
		const inputValue = 5;
		const resultingPromise = applyFns()(inputValue);
		expect(resultingPromise).toBeInstanceOf(Promise);
		return resultingPromise.then(result => {
			expect(result).toEqual([]);
		});
	});
	it("should reject without arguments", async () => {
		expect.assertions(3);
		const inputValue = 5;
		const square = squareMock(jest);
		try {
			await applyFns()(createAsyncPromise(square, false)(inputValue));
			expect(true).toBe(false);
		} catch (e) {
			expect(square).not.toHaveBeenCalled();
			expect(e).toBeInstanceOf(Error);
			expect(e.message).toBe(getErrorMessage(inputValue));
		}
	});
	it("should work without arguments and promise as input", async () => {
		expect.assertions(3);
		const inputValue = 5;
		const square = squareMock(jest);
		const result = await applyFns()(createAsyncPromise(square)(inputValue));
		expect(result).toEqual([]);
		mockFnExpectations(square, 1, 25, inputValue);
	});
	it("should work for functions with promises as parameters", async () => {
		expect.assertions(7);
		const square = squareMock(jest);
		const increment = incrementMock(jest);
		const concatenateTestString = concatenateTestStringMock(jest);
		const inputValue = 5;
		const result = await applyFns(createSyncPromise(square), increment, createAsyncPromise(concatenateTestString))(
			inputValue
		);
		expect(result).toEqual([25, 6, "5test"]);
		mockFnExpectations(square, 1, 25, inputValue);
		mockFnExpectations(increment, 1, 6, inputValue);
		mockFnExpectations(concatenateTestString, 1, "5test", inputValue);
	});
	it("should work for functions with promises as parameters and promise as input value", async () => {
		expect.assertions(9);
		const square = squareMock(jest);
		const squareInAll = squareMock(jest);
		const increment = incrementMock(jest);
		const concatenateTestString = concatenateTestStringMock(jest);
		const inputValue = 5;
		const result = await applyFns(
			createSyncPromise(squareInAll),
			increment,
			createAsyncPromise(concatenateTestString)
		)(createAsyncPromise(square)(inputValue));
		expect(result).toEqual([625, 26, "25test"]);
		mockFnExpectations(square, 1, 25, inputValue);
		mockFnExpectations(squareInAll, 1, 625, 25);
		mockFnExpectations(increment, 1, 26, 25);
		mockFnExpectations(concatenateTestString, 1, "25test", 25);
	});
	it("should return a promise", () => {
		expect.assertions(10);
		const square = squareMock(jest);
		const squareInAll = squareMock(jest);
		const increment = incrementMock(jest);
		const concatenateTestString = concatenateTestStringMock(jest);
		const inputValue = 5;
		const resultingPromise = applyFns(
			createSyncPromise(squareInAll),
			increment,
			createAsyncPromise(concatenateTestString)
		)(createAsyncPromise(square)(inputValue));
		expect(resultingPromise).toBeInstanceOf(Promise);
		return resultingPromise.then(result => {
			expect(result).toEqual([625, 26, "25test"]);
			mockFnExpectations(square, 1, 25, inputValue);
			mockFnExpectations(squareInAll, 1, 625, 25);
			mockFnExpectations(increment, 1, 26, 25);
			mockFnExpectations(concatenateTestString, 1, "25test", 25);
		});
	});
	it("should reject for functions with promises as array and rejected promise as input value", async () => {
		expect.assertions(6);
		const square = squareMock(jest);
		const squareInAll = squareMock(jest);
		const increment = incrementMock(jest);
		const concatenateTestString = concatenateTestStringMock(jest);
		const inputValue = 5;
		try {
			await applyFns(createSyncPromise(squareInAll), increment, createAsyncPromise(concatenateTestString))(
				createAsyncPromise(square, false)(inputValue)
			);
		} catch (e) {
			expect(squareInAll).not.toHaveBeenCalled();
			expect(increment).not.toHaveBeenCalled();
			expect(concatenateTestString).not.toHaveBeenCalled();
			expect(square).not.toHaveBeenCalled();
			expect(e).toBeInstanceOf(Error);
			expect(e.message).toBe(getErrorMessage(inputValue));
		}
	});
	it("should reject with rejected promise as input value classic way", () => {
		expect.assertions(7);
		const square = squareMock(jest);
		const squareInAll = squareMock(jest);
		const increment = incrementMock(jest);
		const concatenateTestString = concatenateTestStringMock(jest);
		const thenHandler = getMockFn(jest)(n => n, "thenHandler");
		const inputValue = 5;
		return applyFns(createSyncPromise(squareInAll), increment, createAsyncPromise(concatenateTestString))(
			createAsyncPromise(square, false)(inputValue)
		)
			.then(thenHandler)
			.catch(e => {
				expect(squareInAll).not.toHaveBeenCalled();
				expect(increment).not.toHaveBeenCalled();
				expect(concatenateTestString).not.toHaveBeenCalled();
				expect(square).not.toHaveBeenCalled();
				expect(e).toBeInstanceOf(Error);
				expect(e.message).toBe(getErrorMessage(inputValue));
				expect(thenHandler).not.toHaveBeenCalled();
			});
	});
	it("should reject for error function and promise as input value", async () => {
		expect.assertions(9);
		const square = squareMock(jest);
		const squareInAll = squareMock(jest);
		const increment = incrementMock(jest);
		const concatenateTestString = concatenateTestStringMock(jest);
		const undefinedErrorFn = getMockFn(jest)(n => n.first.second * n);
		const inputValue = 5;
		try {
			await applyFns(
				createSyncPromise(squareInAll),
				increment,
				undefinedErrorFn,
				createAsyncPromise(concatenateTestString)
			)(createAsyncPromise(square)(inputValue));
		} catch (e) {
			expect(e).toBeInstanceOf(TypeError);
			expect(e.message).toBe("Cannot read property 'second' of undefined");
			mockFnExpectations(square, 1, 25, inputValue);
			mockFnExpectations(squareInAll, 1, 625, 25);
			mockFnExpectations(increment, 1, 26, 25);
			expect(concatenateTestString).not.toHaveBeenCalled();
		}
	});
	it("should reject for error function and promise as input value classic way", () => {
		expect.assertions(10);
		const square = squareMock(jest);
		const squareInAll = squareMock(jest);
		const increment = incrementMock(jest);
		const concatenateTestString = concatenateTestStringMock(jest);
		const undefinedErrorFn = getMockFn(jest)(n => n.first.second * n);
		const thenHandler = getMockFn(jest)(n => n, "thenHandler");
		const inputValue = 5;
		return applyFns(
			createSyncPromise(squareInAll),
			increment,
			undefinedErrorFn,
			createAsyncPromise(concatenateTestString)
		)(createAsyncPromise(square)(inputValue))
			.then(thenHandler)
			.catch(e => {
				expect(e).toBeInstanceOf(TypeError);
				expect(e.message).toBe("Cannot read property 'second' of undefined");
				mockFnExpectations(square, 1, 25, inputValue);
				mockFnExpectations(squareInAll, 1, 625, 25);
				mockFnExpectations(increment, 1, 26, 25);
				expect(concatenateTestString).not.toHaveBeenCalled();
				expect(thenHandler).not.toHaveBeenCalled();
			});
	});
});
