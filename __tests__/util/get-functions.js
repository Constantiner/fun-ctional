import getFunctions from "../../src/util/get-functions";

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
});
