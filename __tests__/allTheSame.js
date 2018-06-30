import allTheSame from "../src/allTheSame";
import { getErrorMessage } from "./test-utils/errorUtils";
import {
	concatenateTestStringMock,
	getMockFn,
	incrementMock,
	mockFnExpectations,
	squareMock
} from "./test-utils/jestMockFns";
import { createAsyncPromise, createSyncPromise } from "./test-utils/promiseUtils";

describe("Composable Promise.all with single input value for all handlers", () => {
	it("should work for functions without promises as parameters", async () => {
		expect.assertions(7);
		const square = squareMock(jest);
		const increment = incrementMock(jest);
		const concatenateTestString = concatenateTestStringMock(jest);
		const inputValue = 5;
		const result = await allTheSame(square, increment, concatenateTestString)(inputValue);
		expect(result).toEqual([25, 6, "5test"]);
		mockFnExpectations(square, 25, inputValue);
		mockFnExpectations(increment, 6, inputValue);
		mockFnExpectations(concatenateTestString, "5test", inputValue);
	});
	it("should work for functions without promises as array", async () => {
		expect.assertions(7);
		const square = squareMock(jest);
		const increment = incrementMock(jest);
		const concatenateTestString = concatenateTestStringMock(jest);
		const inputValue = 5;
		const result = await allTheSame([square, increment, concatenateTestString])(inputValue);
		expect(result).toEqual([25, 6, "5test"]);
		mockFnExpectations(square, 25, inputValue);
		mockFnExpectations(increment, 6, inputValue);
		mockFnExpectations(concatenateTestString, "5test", inputValue);
	});
	it("should work without arguments", async () => {
		expect.assertions(1);
		const inputValue = 5;
		const result = await allTheSame()(inputValue);
		expect(result).toEqual([]);
	});
	it("should return a promise without arguments", () => {
		expect.assertions(2);
		const inputValue = 5;
		const resultingPromise = allTheSame()(inputValue);
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
			await allTheSame()(createAsyncPromise(square)(inputValue, false));
		} catch (e) {
			expect(square).not.toBeCalled();
			expect(e).toBeInstanceOf(Error);
			expect(e.message).toBe(getErrorMessage(inputValue));
		}
	});
	it("should work without arguments and promise as input", async () => {
		expect.assertions(3);
		const inputValue = 5;
		const square = squareMock(jest);
		const result = await allTheSame()(createAsyncPromise(square)(inputValue));
		expect(result).toEqual([]);
		mockFnExpectations(square, 25, inputValue);
	});
	it("should work for functions with promises as parameters", async () => {
		expect.assertions(7);
		const square = squareMock(jest);
		const increment = incrementMock(jest);
		const concatenateTestString = concatenateTestStringMock(jest);
		const inputValue = 5;
		const result = await allTheSame(
			createSyncPromise(square),
			increment,
			createAsyncPromise(concatenateTestString)
		)(inputValue);
		expect(result).toEqual([25, 6, "5test"]);
		mockFnExpectations(square, 25, inputValue);
		mockFnExpectations(increment, 6, inputValue);
		mockFnExpectations(concatenateTestString, "5test", inputValue);
	});
	it("should work for functions with promises as array", async () => {
		expect.assertions(7);
		const square = squareMock(jest);
		const increment = incrementMock(jest);
		const concatenateTestString = concatenateTestStringMock(jest);
		const inputValue = 5;
		const result = await allTheSame([
			createAsyncPromise(square),
			createSyncPromise(increment),
			concatenateTestString
		])(inputValue);
		expect(result).toEqual([25, 6, "5test"]);
		mockFnExpectations(square, 25, inputValue);
		mockFnExpectations(increment, 6, inputValue);
		mockFnExpectations(concatenateTestString, "5test", inputValue);
	});
	it("should work for functions with promises as parameters and promise as input value", async () => {
		expect.assertions(9);
		const square = squareMock(jest);
		const squareInAll = squareMock(jest);
		const increment = incrementMock(jest);
		const concatenateTestString = concatenateTestStringMock(jest);
		const inputValue = 5;
		const result = await allTheSame(
			createSyncPromise(squareInAll),
			increment,
			createAsyncPromise(concatenateTestString)
		)(createAsyncPromise(square)(inputValue));
		expect(result).toEqual([625, 26, "25test"]);
		mockFnExpectations(square, 25, inputValue);
		mockFnExpectations(squareInAll, 625, 25);
		mockFnExpectations(increment, 26, 25);
		mockFnExpectations(concatenateTestString, "25test", 25);
	});
	it("should work for functions with promises as array and promise as input value", async () => {
		expect.assertions(9);
		const square = squareMock(jest);
		const squareInAll = squareMock(jest);
		const increment = incrementMock(jest);
		const concatenateTestString = concatenateTestStringMock(jest);
		const inputValue = 5;
		const result = await allTheSame([
			createSyncPromise(squareInAll),
			increment,
			createAsyncPromise(concatenateTestString)
		])(createAsyncPromise(square)(inputValue));
		expect(result).toEqual([625, 26, "25test"]);
		mockFnExpectations(square, 25, inputValue);
		mockFnExpectations(squareInAll, 625, 25);
		mockFnExpectations(increment, 26, 25);
		mockFnExpectations(concatenateTestString, "25test", 25);
	});
	it("should work for functions with promises as set and promise as input value", async () => {
		expect.assertions(9);
		const square = squareMock(jest);
		const squareInAll = squareMock(jest);
		const increment = incrementMock(jest);
		const concatenateTestString = concatenateTestStringMock(jest);
		const inputValue = 5;
		const result = await allTheSame(
			new Set([createSyncPromise(squareInAll), increment, createAsyncPromise(concatenateTestString)])
		)(createAsyncPromise(square)(inputValue));
		expect(result).toEqual([625, 26, "25test"]);
		mockFnExpectations(square, 25, inputValue);
		mockFnExpectations(squareInAll, 625, 25);
		mockFnExpectations(increment, 26, 25);
		mockFnExpectations(concatenateTestString, "25test", 25);
	});
	it("should return a promise", () => {
		expect.assertions(10);
		const square = squareMock(jest);
		const squareInAll = squareMock(jest);
		const increment = incrementMock(jest);
		const concatenateTestString = concatenateTestStringMock(jest);
		const inputValue = 5;
		const resultingPromise = allTheSame(
			createSyncPromise(squareInAll),
			increment,
			createAsyncPromise(concatenateTestString)
		)(createAsyncPromise(square)(inputValue));
		expect(resultingPromise).toBeInstanceOf(Promise);
		return resultingPromise.then(result => {
			expect(result).toEqual([625, 26, "25test"]);
			mockFnExpectations(square, 25, inputValue);
			mockFnExpectations(squareInAll, 625, 25);
			mockFnExpectations(increment, 26, 25);
			mockFnExpectations(concatenateTestString, "25test", 25);
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
			await allTheSame([createSyncPromise(squareInAll), increment, createAsyncPromise(concatenateTestString)])(
				createAsyncPromise(square)(inputValue, false)
			);
		} catch (e) {
			expect(squareInAll).not.toBeCalled();
			expect(increment).not.toBeCalled();
			expect(concatenateTestString).not.toBeCalled();
			expect(square).not.toBeCalled();
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
		return allTheSame(createSyncPromise(squareInAll), increment, createAsyncPromise(concatenateTestString))(
			createAsyncPromise(square)(inputValue, false)
		)
			.then(thenHandler)
			.catch(e => {
				expect(squareInAll).not.toBeCalled();
				expect(increment).not.toBeCalled();
				expect(concatenateTestString).not.toBeCalled();
				expect(square).not.toBeCalled();
				expect(e).toBeInstanceOf(Error);
				expect(e.message).toBe(getErrorMessage(inputValue));
				expect(thenHandler).not.toBeCalled();
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
			await allTheSame([
				createSyncPromise(squareInAll),
				increment,
				undefinedErrorFn,
				createAsyncPromise(concatenateTestString)
			])(createAsyncPromise(square)(inputValue));
		} catch (e) {
			expect(e).toBeInstanceOf(TypeError);
			expect(e.message).toBe("Cannot read property 'second' of undefined");
			mockFnExpectations(square, 25, inputValue);
			mockFnExpectations(squareInAll, 625, 25);
			mockFnExpectations(increment, 26, 25);
			expect(concatenateTestString).not.toBeCalled();
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
		return allTheSame(
			createSyncPromise(squareInAll),
			increment,
			undefinedErrorFn,
			createAsyncPromise(concatenateTestString)
		)(createAsyncPromise(square)(inputValue))
			.then(thenHandler)
			.catch(e => {
				expect(e).toBeInstanceOf(TypeError);
				expect(e.message).toBe("Cannot read property 'second' of undefined");
				mockFnExpectations(square, 25, inputValue);
				mockFnExpectations(squareInAll, 625, 25);
				mockFnExpectations(increment, 26, 25);
				expect(concatenateTestString).not.toBeCalled();
				expect(thenHandler).not.toBeCalled();
			});
	});
	it("should reject for rejected promise in parameters and promise as input value", async () => {
		expect.assertions(10);
		const square = squareMock(jest, "square");
		const squareInAll = squareMock(jest, "squareInAll");
		const increment = incrementMock(jest, "increment");
		const rejectedPromiseFunc = getMockFn(jest)(
			n => createSyncPromise(squareInAll)(n, false),
			"rejectedPromiseFunc"
		);
		const concatenateTestString = concatenateTestStringMock(jest, "concatenateTestString");
		const inputValue = 5;
		try {
			await allTheSame(new Set([createAsyncPromise(concatenateTestString), rejectedPromiseFunc, increment]))(
				createAsyncPromise(square)(inputValue)
			);
		} catch (e) {
			expect(e).toBeInstanceOf(Error);
			expect(e.message).toBe(getErrorMessage(25));
			mockFnExpectations(square, 25, inputValue);
			mockFnExpectations(rejectedPromiseFunc, expect.any(Promise), 25);
			expect(squareInAll).not.toBeCalled();
			mockFnExpectations(increment, 26, 25);
			expect(concatenateTestString).not.toBeCalled();
		}
	});
	it("should reject for rejected promise in parameters and promise as input value classic way", () => {
		expect.assertions(11);
		const square = squareMock(jest, "square");
		const squareInAll = squareMock(jest, "squareInAll");
		const increment = incrementMock(jest, "increment");
		const rejectedPromiseFunc = getMockFn(jest)(
			n => createSyncPromise(squareInAll)(n, false),
			"rejectedPromiseFunc"
		);
		const concatenateTestString = concatenateTestStringMock(jest, "concatenateTestString");
		const thenHandler = getMockFn(jest)(n => n, "thenHandler");
		const inputValue = 5;
		return allTheSame(new Set([createAsyncPromise(concatenateTestString), rejectedPromiseFunc, increment]))(
			createAsyncPromise(square)(inputValue)
		)
			.then(thenHandler)
			.catch(e => {
				expect(e).toBeInstanceOf(Error);
				expect(e.message).toBe(getErrorMessage(25));
				mockFnExpectations(square, 25, inputValue);
				mockFnExpectations(rejectedPromiseFunc, expect.any(Promise), 25);
				expect(squareInAll).not.toBeCalled();
				mockFnExpectations(increment, 26, 25);
				expect(concatenateTestString).not.toBeCalled();
				expect(thenHandler).not.toBeCalled();
			});
	});
});
