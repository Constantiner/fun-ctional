import { extractArguments, extractArrayFromArgument, extractResolvedArguments } from "../../src/util/extractArguments";
import { createSyncPromise } from "../test-utils/promiseUtils";

describe("extractArrayFromArgument tests", () => {
	it("should always return a promise", () => {
		const result = extractArrayFromArgument([1, 2, 3]);
		expect(result).toBeInstanceOf(Promise);
	});
	it("should resolve promise with array", async () => {
		expect.assertions(1);
		const input = [1, 2, 3];
		const result = await extractArrayFromArgument(createSyncPromise(n => n)(input));
		expect(result).toEqual(input);
	});
	it("should resolve iterable to array", async () => {
		expect.assertions(1);
		const input = [1, 2, 3];
		const result = await extractArrayFromArgument(new Set(input));
		expect(result).toEqual(input);
	});
	it("should resolve single integer aka non-iterable to empty array", async () => {
		expect.assertions(1);
		const result = await extractArrayFromArgument(1);
		expect(result).toEqual([]);
	});
});
describe("extractArguments tests", () => {
	it("should always return a promise", () => {
		const result = extractArguments([1, 2, 3]);
		expect(result).toBeInstanceOf(Promise);
	});
	it("should resolve promise with array", async () => {
		expect.assertions(1);
		const input = [1, 2, 3];
		const result = await extractArguments([createSyncPromise(n => n)(input)]);
		expect(result).toEqual(input);
	});
	it("should accept iterable", async () => {
		expect.assertions(1);
		const input = [1, 2, 3];
		const result = await extractArguments([new Set(input)]);
		expect(result).toEqual(input);
	});
	it("should accept arguments list", async () => {
		expect.assertions(1);
		const input = [1, 2, 3];
		const result = await extractArguments(input);
		expect(result).toEqual(input);
	});
	it("should accept single non iterable", async () => {
		expect.assertions(1);
		const input = [1];
		const result = await extractArguments(input);
		expect(result).toEqual(input);
	});
	it("should accept single string and split it", async () => {
		expect.assertions(1);
		const input = "test";
		const result = await extractArguments([input]);
		expect(result).toEqual(["t", "e", "s", "t"]);
	});
	it("should accept promises list", async () => {
		expect.assertions(1);
		const input = [createSyncPromise(n => n)(1), createSyncPromise(n => n)(2), createSyncPromise(n => n)(3)];
		const result = await extractArguments(input);
		expect(result).toEqual(input);
	});
});

describe("extractResolvedArguments tests", () => {
	it("should return the same array for single function", () => {
		const input = [n => n];
		const result = extractResolvedArguments(input);
		expect(result).toBe(input);
	});
	it("should return the same array for more than one functions", () => {
		const input = [n => n, n => n + 5];
		const result = extractResolvedArguments(input);
		expect(result).toBe(input);
	});
	it("should return the same empty array", () => {
		const input = [];
		const result = extractResolvedArguments(input);
		expect(result).toBe(input);
	});
	it("should return empty array for call without arguments", () => {
		const result = extractResolvedArguments();
		expect(result).toEqual([]);
	});
	it("should return array from first parameter as array", () => {
		const firstParam = [n => n, n => n + 5];
		const result = extractResolvedArguments([firstParam]);
		expect(result).toEqual(firstParam);
	});
	it("should return array from first parameter as iterable", () => {
		const firstParamInitValue = [n => n, n => n + 5];
		const firstParam = new Set(firstParamInitValue);
		const result = extractResolvedArguments([firstParam]);
		expect(result).toEqual(firstParamInitValue);
	});
});
