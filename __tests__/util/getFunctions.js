import getFunctions from "../../src/util/getFunctions";

describe("getFunctions tests", () => {
	it("should return the same array for single function", () => {
		const input = [n => n];
		const result = getFunctions(input);
		expect(result).toBe(input);
	});
	it("should return the same array for more than one functions", () => {
		const input = [n => n, n => n + 5];
		const result = getFunctions(input);
		expect(result).toBe(input);
	});
	it("should return the same empty array", () => {
		const input = [];
		const result = getFunctions(input);
		expect(result).toBe(input);
	});
	it("should return empty array for call without arguments", () => {
		const result = getFunctions();
		expect(result).toEqual([]);
	});
	it("should return array from first parameter as array", () => {
		const firstParam = [n => n, n => n + 5];
		const input = [firstParam];
		const result = getFunctions(input);
		expect(result).toEqual(firstParam);
	});
	it("should return array from first parameter as iterable", () => {
		const firstParamInitValue = [n => n, n => n + 5];
		const firstParam = new Set(firstParamInitValue);
		const input = [firstParam];
		const result = getFunctions(input);
		expect(result).toEqual(firstParamInitValue);
	});
});