import apipe from "../src/apipe";
import { createAsyncPromise, createSyncPromise } from "./test-utils/promise-utils";
import { getErrorMessage } from "./test-utils/error-utils";
import {
	squareMock,
	incrementMock,
	mockFnExpectations,
	getMockFn,
	mockFnArgumentsExpectations
} from "./test-utils/jest-mock-fns";

describe("Tests for asynchronous pipe utility", () => {
	it("should resolve a number with empty pipe", async () => {
		const aNumber = 4;
		const result = await apipe()(aNumber);
		expect(result).toBe(aNumber);
	});
	it("should resolve null value with empty pipe", async () => {
		const result = await apipe()(null);
		expect(result).toBeNull();
	});
	it("should resolve undefined value with empty pipe", async () => {
		const result = await apipe()();
		expect(result).toBeUndefined();
	});
	it("should resolve a string with empty pipe", async () => {
		const aString = "some test string";
		const result = await apipe()(aString);
		expect(result).toBe(aString);
	});
	it("should resolve an object with empty pipe", async () => {
		const anObject = {
			first: "test",
			second: true
		};
		const result = await apipe()(anObject);
		expect(result).toBe(anObject);
	});
	it("should resolve an async promise with empty pipe", async () => {
		expect.assertions(3);
		const aNumber = 4;
		const square = squareMock(jest);
		const aPromise = createAsyncPromise(square)(aNumber);
		const result = await apipe()(aPromise);
		expect(result).toBe(16);
		mockFnExpectations(square, 16, aNumber);
	});
	it('should resolve a "sync" promise with empty pipe', async () => {
		expect.assertions(3);
		const aNumber = 4;
		const square = squareMock(jest);
		const aPromise = createSyncPromise(square)(aNumber);
		const result = await apipe()(aPromise);
		expect(result).toBe(16);
		mockFnExpectations(square, 16, aNumber);
	});
	it("should return a promise with number and empty pipe", () => {
		expect.assertions(2);
		const inputValue = 4;
		const result = apipe()(inputValue);
		expect(result).toBeInstanceOf(Promise);
		return result.then(result => {
			expect(result).toBe(inputValue);
		});
	});
	it("should return a promise with promise and empty pipe", () => {
		expect.assertions(4);
		const inputValue = 4;
		const square = squareMock(jest);
		const result = apipe()(createAsyncPromise(square)(inputValue));
		expect(result).toBeInstanceOf(Promise);
		return result.then(result => {
			expect(result).toBe(16);
			mockFnExpectations(square, 16, inputValue);
		});
	});
	it("should return a promise with number and pipe functions", () => {
		expect.assertions(6);
		const inputValue = 4;
		const square = squareMock(jest);
		const increment = incrementMock(jest);
		const result = apipe(square, increment)(inputValue);
		expect(result).toBeInstanceOf(Promise);
		return result.then(result => {
			expect(result).toBe(17);
			mockFnExpectations(square, 16, inputValue);
			mockFnExpectations(increment, 17, 16);
		});
	});
	it("should return a promise with promise and pipe functions", () => {
		expect.assertions(8);
		const inputValue = 4;
		const square = squareMock(jest);
		const incrementInCompose = incrementMock(jest);
		const increment = incrementMock(jest);
		const result = apipe(square, incrementInCompose)(createAsyncPromise(increment)(inputValue));
		expect(result).toBeInstanceOf(Promise);
		return result.then(result => {
			expect(result).toBe(26);
			mockFnExpectations(increment, 5, inputValue);
			mockFnExpectations(square, 25, 5);
			mockFnExpectations(incrementInCompose, 26, 25);
		});
	});
	it("should pipe a number properly", async () => {
		expect.assertions(5);
		const inputValue = 4;
		const square = squareMock(jest);
		const increment = incrementMock(jest);
		const result = await apipe(square, increment)(inputValue);
		expect(result).toBe(17);
		mockFnExpectations(square, 16, inputValue);
		mockFnExpectations(increment, 17, 16);
	});
	it("should pipe a number properly with async promise", async () => {
		expect.assertions(7);
		const inputValue = 4;
		const increment = incrementMock(jest);
		const square = squareMock(jest);
		const incrementInCompose = incrementMock(jest);
		const result = await apipe(square, incrementInCompose)(createAsyncPromise(increment)(inputValue));
		expect(result).toBe(26);
		mockFnExpectations(increment, 5, inputValue);
		mockFnExpectations(square, 25, 5);
		mockFnExpectations(incrementInCompose, 26, 25);
	});
	it("should pipe a number properly with async promise and async promise in functions chain", async () => {
		expect.assertions(9);
		const inputValue = 4;
		const increment = incrementMock(jest);
		const square = squareMock(jest);
		const incrementInCompose = incrementMock(jest);
		const incrementInPromiseInCompose = incrementMock(jest);
		const result = await apipe(square, createAsyncPromise(incrementInPromiseInCompose), incrementInCompose)(
			createAsyncPromise(increment)(inputValue)
		);
		expect(result).toBe(27);
		mockFnExpectations(increment, 5, inputValue);
		mockFnExpectations(square, 25, 5);
		mockFnExpectations(incrementInPromiseInCompose, 26, 25);
		mockFnExpectations(incrementInCompose, 27, 26);
	});
	it('should pipe a number properly with "sync" pipe', async () => {
		expect.assertions(7);
		const inputValue = 4;
		const increment = incrementMock(jest);
		const square = squareMock(jest);
		const incrementInCompose = incrementMock(jest);
		const result = await apipe(square, incrementInCompose)(createSyncPromise(increment)(inputValue));
		expect(result).toBe(26);
		mockFnExpectations(increment, 5, inputValue);
		mockFnExpectations(square, 25, 5);
		mockFnExpectations(incrementInCompose, 26, 25);
	});
	it("should reject properly with async promise and pipe functions", async () => {
		expect.assertions(5);
		const increment = incrementMock(jest);
		const squareInCompose = squareMock(jest);
		const square = squareMock(jest);
		try {
			await apipe(squareInCompose, increment)(createAsyncPromise(square)(4, false));
		} catch (e) {
			expect(e).toBeInstanceOf(Error);
			expect(e.message).toBe(getErrorMessage(4));
			expect(square).not.toHaveBeenCalled();
			expect(squareInCompose).not.toHaveBeenCalled();
			expect(increment).not.toHaveBeenCalled();
		}
	});
	it("should reject properly with async promise and empty pipe", async () => {
		expect.assertions(3);
		const increment = incrementMock(jest);
		try {
			await apipe()(createAsyncPromise(increment)(4, false));
		} catch (e) {
			expect(e).toBeInstanceOf(Error);
			expect(e.message).toBe(getErrorMessage(4));
			expect(increment).not.toHaveBeenCalled();
		}
	});
	it("should reject properly with rejection in one of the pipe functions", async () => {
		expect.assertions(6);
		const inputValue = 4;
		const increment = incrementMock(jest);
		const incrementInCompose = incrementMock(jest);
		const undefinedErrorFn = getMockFn(jest)(n => n.first.second * n);
		try {
			await apipe(undefinedErrorFn, incrementInCompose)(createAsyncPromise(increment)(inputValue));
		} catch (e) {
			expect(e).toBeInstanceOf(TypeError);
			expect(e.message).toBe("Cannot read property 'second' of undefined");
			mockFnExpectations(increment, 5, inputValue);
			mockFnArgumentsExpectations(undefinedErrorFn, 5);
			expect(incrementInCompose).not.toHaveBeenCalled();
		}
	});
	it("should reject properly with rejection in one of the promise generating pipe functions", async () => {
		expect.assertions(8);
		const inputValue = 4;
		const increment = incrementMock(jest);
		const incrementInCompose = incrementMock(jest);
		const incrementInPromiseInCompose = incrementMock(jest);
		const square = squareMock(jest);
		try {
			await apipe(square, n => createAsyncPromise(incrementInPromiseInCompose)(n, false), incrementInCompose)(
				createAsyncPromise(increment)(inputValue)
			);
		} catch (e) {
			expect(e).toBeInstanceOf(Error);
			expect(e.message).toBe(getErrorMessage(25));
			mockFnExpectations(increment, 5, inputValue);
			mockFnExpectations(square, 25, 5);
			expect(incrementInPromiseInCompose).not.toHaveBeenCalled();
			expect(incrementInCompose).not.toHaveBeenCalled();
		}
	});
	it("should reject properly with async promise and empty pipe traditional way", () => {
		expect.assertions(4);
		const inputValue = 4;
		const increment = incrementMock(jest);
		const thenHandler = getMockFn(jest)(n => n, "thenHandler");
		return apipe()(createAsyncPromise(increment)(inputValue, false))
			.then(thenHandler)
			.catch(e => {
				expect(e).toBeInstanceOf(Error);
				expect(e.message).toBe(getErrorMessage(inputValue));
				expect(increment).not.toHaveBeenCalled();
				expect(thenHandler).not.toBeCalled();
			});
	});
	it("should reject properly with rejection in one of the pipe functions traditional way", () => {
		expect.assertions(7);
		const inputValue = 4;
		const increment = incrementMock(jest);
		const incrementInCompose = incrementMock(jest);
		const undefinedErrorFn = getMockFn(jest)(n => n.first.second * n);
		const thenHandler = getMockFn(jest)(n => n, "thenHandler");
		return apipe(undefinedErrorFn, incrementInCompose)(createAsyncPromise(increment)(inputValue))
			.then(thenHandler)
			.catch(e => {
				expect(e).toBeInstanceOf(TypeError);
				expect(e.message).toBe("Cannot read property 'second' of undefined");
				mockFnExpectations(increment, 5, inputValue);
				mockFnArgumentsExpectations(undefinedErrorFn, 5);
				expect(incrementInCompose).not.toHaveBeenCalled();
				expect(thenHandler).not.toBeCalled();
			});
	});
});
