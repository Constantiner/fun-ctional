import areduceRight from "../src/areduceRight";

describe("areduceRight tests", () => {
	it("should work for base case with synchronous data", async () => {
		const sum = await areduceRight((acc, value) => acc + value)([1, 2, 3, 2]);
		expect(sum).toBe(8);
	});
	it("should work for base case with synchronous data and initial value", async () => {
		const sum = await areduceRight((acc, value) => acc + value, 7)([1, 2, 3, 2]);
		expect(sum).toBe(15);
	});
});