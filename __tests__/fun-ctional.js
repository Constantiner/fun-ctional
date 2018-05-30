import { acompose } from "../src/fun-ctional";

const getErrorMessage = value => `Error with value "${value}"`;
const getError = value => new Error(getErrorMessage(value));
const createAsyncPromise = (valueToResolve, successful = true) =>
	new Promise((resolve, reject) => {
		setTimeout(() => (successful ? resolve(valueToResolve) : reject(getError(valueToResolve))), 100);
	});
const createSyncPromise = (valueToResolve, successful = true) =>
	successful ? Promise.resolve(valueToResolve) : Promise.reject(getError(valueToResolve));

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
		const aNumber = 4;
		const aPromise = createAsyncPromise(aNumber);
		const result = await acompose()(aPromise);
		expect(result).toBe(aNumber);
	});
	it('should resolve a "sync" promise with empty compose', async () => {
		const aNumber = 4;
		const aPromise = createSyncPromise(aNumber);
		const result = await acompose()(aPromise);
		expect(result).toBe(aNumber);
	});
	it("should return a promise with number and empty compose", () => {
		const result = acompose()(4);
		expect(result).toBeInstanceOf(Promise);
	});
	it("should return a promise with promise and empty compose", () => {
		const result = acompose()(createAsyncPromise(4));
		expect(result).toBeInstanceOf(Promise);
	});
	it("should return a promise with number and compose functions", () => {
		const result = acompose(n => n + 1, n => n * n)(4);
		expect(result).toBeInstanceOf(Promise);
	});
	it("should return a promise with promise and compose functions", () => {
		const result = acompose(n => n + 1, n => n * n)(createAsyncPromise(4));
		expect(result).toBeInstanceOf(Promise);
	});
	it("should compose a number properly", async () => {
		const result = await acompose(n => n + 1, n => n * n)(4);
		expect(result).toBe(17);
	});
	it("should compose a number properly with async promise", async () => {
		const result = await acompose(n => n + 1, n => n * n)(createAsyncPromise(4));
		expect(result).toBe(17);
	});
	it('should compose a number properly with "sync" compose', async () => {
		const result = await acompose(n => n + 1, n => n * n)(createSyncPromise(4));
		expect(result).toBe(17);
	});
	it("should reject properly with async promise and compose functions", async () => {
		expect.assertions(2);
		try {
			await acompose(n => n + 1, n => n * n)(createAsyncPromise(4, false));
		} catch (e) {
			expect(e).toBeInstanceOf(Error);
			expect(e.message).toBe(getErrorMessage(4));
		}
	});
	it("should reject properly with async promise anc empty compose", async () => {
		expect.assertions(2);
		try {
			await acompose()(createAsyncPromise(4, false));
		} catch (e) {
			expect(e).toBeInstanceOf(Error);
			expect(e.message).toBe(getErrorMessage(4));
		}
	});
	it("should reject properly with rejection in one of the compose functions", async () => {
		expect.assertions(2);
		try {
			await acompose(n => n + 1, n => n.first.second * n)(createAsyncPromise(4));
		} catch (e) {
			expect(e).toBeInstanceOf(TypeError);
			expect(e.message).toBe("Cannot read property 'second' of undefined");
		}
	});
	it("should reject properly with async promise anc empty compose traditional way", () => {
		expect.assertions(2);
		return acompose()(createAsyncPromise(4, false)).catch(e => {
			expect(e).toBeInstanceOf(Error);
			expect(e.message).toBe(getErrorMessage(4));
		});
	});
	it("should reject properly with rejection in one of the compose functions traditional way", () => {
		expect.assertions(2);
		return acompose(n => n + 1, n => n.first.second * n)(createAsyncPromise(4)).catch(e => {
			expect(e).toBeInstanceOf(TypeError);
			expect(e.message).toBe("Cannot read property 'second' of undefined");
		});
	});
});
