import acompose from "../src/acompose";
import { getErrorMessage } from "./test-utils/errorUtils";
import {
	getMockFn,
	incrementMock,
	mockFnArgumentsExpectations,
	mockFnExpectations,
	squareMock
} from "./test-utils/jestMockFns";
import { createAsyncPromise, createSyncPromise } from "./test-utils/promiseUtils";

describe("Tests for asynchronous compose utility", () => {
	it("should resolve a number with empty compose", async () => {
		const aNumber = 4;
		const result = await acompose()(aNumber);
		expect(result).toBe(aNumber);
	});
	it("should resolve null value with empty compose", async () => {
		const result = await acompose()(null);
		expect(result).toBeNull();
	});
	it("should resolve undefined value with empty compose", async () => {
		const result = await acompose()();
		expect(result).toBeUndefined();
	});
	it("should resolve a string with empty compose", async () => {
		const aString = "some test string";
		const result = await acompose()(aString);
		expect(result).toBe(aString);
	});
	it("should resolve an object with empty compose", async () => {
		const anObject = {
			first: "test",
			second: true
		};
		const result = await acompose()(anObject);
		expect(result).toBe(anObject);
	});
	it("should resolve an async promise with empty compose", async () => {
		expect.assertions(3);
		const aNumber = 4;
		const square = squareMock(jest);
		const aPromise = createAsyncPromise(square)(aNumber);
		const result = await acompose()(aPromise);
		expect(result).toBe(16);
		mockFnExpectations(square, 1, 16, aNumber);
	});
	it('should resolve a "sync" promise with empty compose', async () => {
		expect.assertions(3);
		const aNumber = 4;
		const square = squareMock(jest);
		const aPromise = createSyncPromise(square)(aNumber);
		const result = await acompose()(aPromise);
		expect(result).toBe(16);
		mockFnExpectations(square, 1, 16, aNumber);
	});
	it("should return a promise with number and empty compose", () => {
		expect.assertions(2);
		const inputValue = 4;
		const result = acompose()(inputValue);
		expect(result).toBeInstanceOf(Promise);
		return result.then(result => {
			expect(result).toBe(inputValue);
		});
	});
	it("should return a promise with promise and empty compose", () => {
		expect.assertions(4);
		const inputValue = 4;
		const square = squareMock(jest);
		const result = acompose()(createAsyncPromise(square)(inputValue));
		expect(result).toBeInstanceOf(Promise);
		return result.then(result => {
			expect(result).toBe(16);
			mockFnExpectations(square, 1, 16, inputValue);
		});
	});
	it("should return a promise with number and compose functions", () => {
		expect.assertions(6);
		const inputValue = 4;
		const square = squareMock(jest);
		const increment = incrementMock(jest);
		const result = acompose(increment, square)(inputValue);
		expect(result).toBeInstanceOf(Promise);
		return result.then(result => {
			expect(result).toBe(17);
			mockFnExpectations(square, 1, 16, inputValue);
			mockFnExpectations(increment, 1, 17, 16);
		});
	});
	it("should return a promise with promise and compose functions", () => {
		expect.assertions(8);
		const inputValue = 4;
		const square = squareMock(jest);
		const incrementInCompose = incrementMock(jest);
		const increment = incrementMock(jest);
		const result = acompose(incrementInCompose, square)(createAsyncPromise(increment)(inputValue));
		expect(result).toBeInstanceOf(Promise);
		return result.then(result => {
			expect(result).toBe(26);
			mockFnExpectations(increment, 1, 5, inputValue);
			mockFnExpectations(square, 1, 25, 5);
			mockFnExpectations(incrementInCompose, 1, 26, 25);
		});
	});
	it("should compose a number properly", async () => {
		expect.assertions(5);
		const inputValue = 4;
		const square = squareMock(jest);
		const increment = incrementMock(jest);
		const result = await acompose(increment, square)(inputValue);
		expect(result).toBe(17);
		mockFnExpectations(square, 1, 16, inputValue);
		mockFnExpectations(increment, 1, 17, 16);
	});
	it("should compose a number properly with async promise", async () => {
		expect.assertions(7);
		const inputValue = 4;
		const increment = incrementMock(jest);
		const square = squareMock(jest);
		const incrementInCompose = incrementMock(jest);
		const result = await acompose(incrementInCompose, square)(createAsyncPromise(increment)(inputValue));
		expect(result).toBe(26);
		mockFnExpectations(increment, 1, 5, inputValue);
		mockFnExpectations(square, 1, 25, 5);
		mockFnExpectations(incrementInCompose, 1, 26, 25);
	});
	it("should compose a number properly with async promise and async promise in functions chain", async () => {
		expect.assertions(9);
		const inputValue = 4;
		const increment = incrementMock(jest);
		const square = squareMock(jest);
		const incrementInCompose = incrementMock(jest);
		const incrementInPromiseInCompose = incrementMock(jest);
		const result = await acompose(incrementInCompose, createAsyncPromise(incrementInPromiseInCompose), square)(
			createAsyncPromise(increment)(inputValue)
		);
		expect(result).toBe(27);
		mockFnExpectations(increment, 1, 5, inputValue);
		mockFnExpectations(square, 1, 25, 5);
		mockFnExpectations(incrementInPromiseInCompose, 1, 26, 25);
		mockFnExpectations(incrementInCompose, 1, 27, 26);
	});
	it('should compose a number properly with "sync" compose', async () => {
		expect.assertions(7);
		const inputValue = 4;
		const increment = incrementMock(jest);
		const square = squareMock(jest);
		const incrementInCompose = incrementMock(jest);
		const result = await acompose(incrementInCompose, square)(createSyncPromise(increment)(inputValue));
		expect(result).toBe(26);
		mockFnExpectations(increment, 1, 5, inputValue);
		mockFnExpectations(square, 1, 25, 5);
		mockFnExpectations(incrementInCompose, 1, 26, 25);
	});
	it("should reject properly with async promise and compose functions", async () => {
		expect.assertions(5);
		const increment = incrementMock(jest);
		const squareInCompose = squareMock(jest);
		const square = squareMock(jest);
		try {
			await acompose([increment, squareInCompose])(createAsyncPromise(square, false)(4));
		} catch (e) {
			expect(e).toBeInstanceOf(Error);
			expect(e.message).toBe(getErrorMessage(4));
			expect(square).not.toHaveBeenCalled();
			expect(squareInCompose).not.toHaveBeenCalled();
			expect(increment).not.toHaveBeenCalled();
		}
	});
	it("should reject properly with async promise and empty compose", async () => {
		expect.assertions(3);
		const increment = incrementMock(jest);
		try {
			await acompose()(createAsyncPromise(increment, false)(4));
		} catch (e) {
			expect(e).toBeInstanceOf(Error);
			expect(e.message).toBe(getErrorMessage(4));
			expect(increment).not.toHaveBeenCalled();
		}
	});
	it("should reject properly with rejection in one of the compose functions", async () => {
		expect.assertions(6);
		const inputValue = 4;
		const increment = incrementMock(jest);
		const incrementInCompose = incrementMock(jest);
		const undefinedErrorFn = getMockFn(jest)(n => n.first.second * n);
		try {
			await acompose(incrementInCompose, undefinedErrorFn)(createAsyncPromise(increment)(inputValue));
		} catch (e) {
			expect(e).toBeInstanceOf(TypeError);
			expect(e.message).toBe("Cannot read property 'second' of undefined");
			mockFnExpectations(increment, 1, 5, inputValue);
			mockFnArgumentsExpectations(undefinedErrorFn, 1, 5);
			expect(incrementInCompose).not.toHaveBeenCalled();
		}
	});
	it("should reject properly with rejection in one of the promise generating compose functions", async () => {
		expect.assertions(8);
		const inputValue = 4;
		const increment = incrementMock(jest);
		const incrementInCompose = incrementMock(jest);
		const incrementInPromiseInCompose = incrementMock(jest);
		const square = squareMock(jest);
		try {
			await acompose(incrementInCompose, createAsyncPromise(incrementInPromiseInCompose, false), square)(
				createAsyncPromise(increment)(inputValue)
			);
		} catch (e) {
			expect(e).toBeInstanceOf(Error);
			expect(e.message).toBe(getErrorMessage(25));
			mockFnExpectations(increment, 1, 5, inputValue);
			mockFnExpectations(square, 1, 25, 5);
			expect(incrementInPromiseInCompose).not.toHaveBeenCalled();
			expect(incrementInCompose).not.toHaveBeenCalled();
		}
	});
	it("should reject properly with async promise and empty compose traditional way", () => {
		expect.assertions(4);
		const inputValue = 4;
		const increment = incrementMock(jest);
		const thenHandler = getMockFn(jest)(n => n, "thenHandler");
		return acompose()(createAsyncPromise(increment, false)(inputValue))
			.then(thenHandler)
			.catch(e => {
				expect(e).toBeInstanceOf(Error);
				expect(e.message).toBe(getErrorMessage(inputValue));
				expect(increment).not.toHaveBeenCalled();
				expect(thenHandler).not.toHaveBeenCalled();
			});
	});
	it("should reject properly with rejection in one of the compose functions traditional way", () => {
		expect.assertions(7);
		const inputValue = 4;
		const increment = incrementMock(jest);
		const incrementInCompose = incrementMock(jest);
		const undefinedErrorFn = getMockFn(jest)(n => n.first.second * n);
		const thenHandler = getMockFn(jest)(n => n, "thenHandler");
		return acompose(incrementInCompose, undefinedErrorFn)(createAsyncPromise(increment)(inputValue))
			.then(thenHandler)
			.catch(e => {
				expect(e).toBeInstanceOf(TypeError);
				expect(e.message).toBe("Cannot read property 'second' of undefined");
				mockFnExpectations(increment, 1, 5, inputValue);
				mockFnArgumentsExpectations(undefinedErrorFn, 1, 5);
				expect(incrementInCompose).not.toHaveBeenCalled();
				expect(thenHandler).not.toHaveBeenCalled();
			});
	});
});
