import amapSeq from "../src/amapSeq";
import { mockFnExpectations, squareMock } from "./test-utils/jestMockFns";

describe("amapSeq tests", () => {
	it("should work for base case", async () => {
		expect.assertions(6);
		const input1 = 4;
		const input2 = 5;
		const inputValue = [input1, input2];
		const square = squareMock(jest, "square");
		const result = await amapSeq(square)(inputValue);
		expect(result).toEqual([16, 25]);
		expect(square).toHaveBeenCalledTimes(2);
		mockFnExpectations(square, 1, 16, input1, 0, inputValue);
		mockFnExpectations(square, 2, 25, input2, 1, inputValue);
	});
});
