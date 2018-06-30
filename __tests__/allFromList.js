import allFromList from "../src/allFromList";
import {
	mockFnExpectations,
	squareMock
} from "./test-utils/jestMockFns";

describe("allFromList tests", () => {
	it("should work for base case", async () => {
		expect.assertions(6);
		const input1 = 4;
		const input2 = 5;
		const square = squareMock(jest, "square");
		const result = await allFromList(square)(input1, input2);
		expect(result).toEqual([16, 25]);
		expect(square).toHaveBeenCalledTimes(2);
		mockFnExpectations(square, 1, 16, 4);
		mockFnExpectations(square, 2, 25, 5);
	});
});
