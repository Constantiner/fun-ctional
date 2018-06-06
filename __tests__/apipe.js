import { apipe } from "../src/apipe";
import { getErrorMessage, createAsyncPromise, createSyncPromise } from "./utils/utils";

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
		const aNumber = 4;
		const aPromise = createAsyncPromise(aNumber);
		const result = await apipe()(aPromise);
		expect(result).toBe(aNumber);
	});
	it('should resolve a "sync" promise with empty pipe', async () => {
		const aNumber = 4;
		const aPromise = createSyncPromise(aNumber);
		const result = await apipe()(aPromise);
		expect(result).toBe(aNumber);
	});
	it("should return a promise with number and empty pipe", () => {
		const result = apipe()(4);
		expect(result).toBeInstanceOf(Promise);
	});
	it("should return a promise with promise and empty pipe", () => {
		const result = apipe()(createAsyncPromise(4));
		expect(result).toBeInstanceOf(Promise);
	});
	it("should return a promise with number and pipe functions", () => {
		const result = apipe(n => n + 1, n => n * n)(4);
		expect(result).toBeInstanceOf(Promise);
	});
	it("should return a promise with promise and pipe functions", () => {
		const result = apipe(n => n + 1, n => n * n)(createAsyncPromise(4));
		expect(result).toBeInstanceOf(Promise);
	});
	it("should pipe a number properly", async () => {
		const result = await apipe(n => n + 1, n => n * n)(4);
		expect(result).toBe(25);
	});
	it("should pipe a number properly with async promise", async () => {
		const result = await apipe(n => n + 1, n => n * n)(createAsyncPromise(4));
		expect(result).toBe(25);
	});
	it("should pipe a number properly with async promise and async promise in functions chain", async () => {
		const result = await apipe(n => n + 1, createAsyncPromise, n => n * n)(createAsyncPromise(4));
		expect(result).toBe(25);
	});
	it('should pipe a number properly with "sync" pipe', async () => {
		const result = await apipe(n => n + 1, n => n * n)(createSyncPromise(4));
		expect(result).toBe(25);
	});
	it("should reject properly with async promise and pipe functions", async () => {
		expect.assertions(2);
		try {
			await apipe(n => n + 1, n => n * n)(createAsyncPromise(4, false));
		} catch (e) {
			expect(e).toBeInstanceOf(Error);
			expect(e.message).toBe(getErrorMessage(4));
		}
	});
	it("should reject properly with async promise and empty pipe", async () => {
		expect.assertions(2);
		try {
			await apipe()(createAsyncPromise(4, false));
		} catch (e) {
			expect(e).toBeInstanceOf(Error);
			expect(e.message).toBe(getErrorMessage(4));
		}
	});
	it("should reject properly with rejection in one of the pipe functions", async () => {
		expect.assertions(2);
		try {
			await apipe(n => n + 1, n => n.first.second * n)(createAsyncPromise(4));
		} catch (e) {
			expect(e).toBeInstanceOf(TypeError);
			expect(e.message).toBe("Cannot read property 'second' of undefined");
		}
	});
	it("should reject properly with rejection in one of the promise generating pipe functions", async () => {
		expect.assertions(2);
		try {
			await apipe(n => n + 1, n => createAsyncPromise(n, false), n => n * n)(createAsyncPromise(4));
		} catch (e) {
			expect(e).toBeInstanceOf(Error);
			expect(e.message).toBe(getErrorMessage(5));
		}
	});
	it("should reject properly with async promise and empty pipe traditional way", () => {
		expect.assertions(2);
		return apipe()(createAsyncPromise(4, false)).catch(e => {
			expect(e).toBeInstanceOf(Error);
			expect(e.message).toBe(getErrorMessage(4));
		});
	});
	it("should reject properly with rejection in one of the pipe functions traditional way", () => {
		expect.assertions(2);
		return apipe(n => n + 1, n => n.first.second * n)(createAsyncPromise(4)).catch(e => {
			expect(e).toBeInstanceOf(TypeError);
			expect(e.message).toBe("Cannot read property 'second' of undefined");
		});
	});
});