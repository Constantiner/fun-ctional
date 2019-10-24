import { extractArrayFromArgument, extractArrayOfPromisesFromArgument } from "../../src/util/extractArrayFromArgument";
import { createAsyncPromise, createSyncPromise } from "../test-utils/promiseUtils";

describe("extractArrayFromArgument module tests", () => {
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
	describe("extractArrayOfPromisesFromArgument tests", () => {
		it("should always return a promise", () => {
			const result = extractArrayOfPromisesFromArgument([1, 2, 3]);
			expect(result).toBeInstanceOf(Promise);
		});
		it("should always return an array of promises", async () => {
			const originalValues = [1, 2, 3];
			expect.assertions(originalValues.length + 2);
			const result = await extractArrayOfPromisesFromArgument(originalValues);
			expect(result).toBeInstanceOf(Array);
			expect(result.length).toEqual(originalValues.length);
			result.forEach(item => expect(item).toBeInstanceOf(Promise));
		});
		it("should always return an array of promises with the same values", async () => {
			expect.assertions(1);
			const originalValues = [1, 2];
			const result = await extractArrayOfPromisesFromArgument(originalValues);
			const resultingValues = await Promise.all(result);
			expect(resultingValues).toEqual(originalValues);
		});
		it("should always return an array of the same values from array like", async () => {
			expect.assertions(1);
			const originalValues = [1, 2];
			const arrayLike = {
				length: 2,
				0: originalValues[0],
				1: originalValues[1]
			};
			const result = await extractArrayOfPromisesFromArgument(arrayLike);
			const resultingValues = await Promise.all(result);
			expect(resultingValues).toEqual(originalValues);
		});
		it("should always return an array of the same values from iterator", async () => {
			expect.assertions(1);
			const originalValues = [1, 2];
			const iterator = new Set(originalValues);
			const result = await extractArrayOfPromisesFromArgument(iterator);
			const resultingValues = await Promise.all(result);
			expect(resultingValues).toEqual(originalValues);
		});
		it("should always return an array of promises with the same values from array of promises", async () => {
			expect.assertions(1);
			const originalValues = [1, 2];
			const inputPromises = originalValues.map(value => createAsyncPromise(n => n)(value));
			const result = await extractArrayOfPromisesFromArgument(inputPromises);
			const resultingValues = await Promise.all(result);
			expect(resultingValues).toEqual(originalValues);
		});
	});
});
