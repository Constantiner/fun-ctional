import allTheSame from "../src/all-the-same";
import { squareMock, incrementMock, concatenateTestStringMock, mockFnExpectations } from "./test-utils/jest-mock-fns";

describe("Composable Promise.all with single input value for all handlers", () => {
	it("should work for functions without promises as parameters", async () => {
		const square = squareMock(jest);
		const increment = incrementMock(jest);
		const concatenateTestString = concatenateTestStringMock(jest);
		const inputValue = 5;
		const result = await allTheSame(square, increment, concatenateTestString)(inputValue);
		expect(result).toEqual([25, 6, "5test"]);
		mockFnExpectations(square, 25, inputValue);
		mockFnExpectations(increment, 6, inputValue);
		mockFnExpectations(concatenateTestString, "5test", inputValue);
	});
	it("should work for functions without promises as array", async () => {
		const square = squareMock(jest);
		const increment = incrementMock(jest);
		const concatenateTestString = concatenateTestStringMock(jest);
		const inputValue = 5;
		const result = await allTheSame([square, increment, concatenateTestString])(inputValue);
		expect(result).toEqual([25, 6, "5test"]);
		mockFnExpectations(square, 25, inputValue);
		mockFnExpectations(increment, 6, inputValue);
		mockFnExpectations(concatenateTestString, "5test", inputValue);
	});
	it("should work for without arguments", async () => {
		const result = await allTheSame()(5);
		expect(result).toEqual([]);
	});
});
