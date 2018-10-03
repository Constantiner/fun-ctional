import extractArrayFromArgument from "../../src/util/extractArrayFromArgument";
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