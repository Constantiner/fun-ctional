import { extractResolvedArguments } from "../../src/util/extractArguments";

describe("getFunctions tests", () => {
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
