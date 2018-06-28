import isIterable from "../../src/util/is-iterable";

const testGenerator = function*() {
	yield 1;
	yield 2;
};

const emptyGenerator = function*() {};

const makeIterator = array => ({
	index: 0,
	[Symbol.iterator]() {
		return {
			next: () => {
				if (this.index < array.length) {
					return { value: array[this.index++], done: false };
				}
				return { done: true };
			}
		};
	}
});

describe("isIterable tests", () => {
	it("should be true for strings", () => {
		expect(isIterable("test")).toBe(true);
	});
	it("should be true for empty strings", () => {
		expect(isIterable("")).toBe(true);
	});
	it("should be true for arrays", () => {
		expect(isIterable([1, 2, 3])).toBe(true);
	});
	it("should be true for empty array", () => {
		expect(isIterable([])).toBe(true);
	});
	it("should be true for generators", () => {
		expect(isIterable(testGenerator())).toBe(true);
	});
	it("should be true for empty generator", () => {
		expect(isIterable(emptyGenerator())).toBe(true);
	});
	it("should be true for Maps", () => {
		expect(isIterable(new Map([[1, "one"], [2, "two"], [3, "tree"]]))).toBe(true);
	});
	it("should be true for empty Maps", () => {
		expect(isIterable(new Map())).toBe(true);
	});
	it("should be true for Sets", () => {
		expect(isIterable(new Set([1, 2, 3]))).toBe(true);
	});
	it("should be true for empty Sets", () => {
		expect(isIterable(new Set())).toBe(true);
	});
	it("should be true for custom iterator", () => {
		expect.assertions(1);
		expect(isIterable(makeIterator([1, 2, 3]))).toBe(true);
	});
	it("should be true for empty custom iterator", () => {
		expect.assertions(1);
		expect(isIterable(makeIterator([]))).toBe(true);
	});
	it("should be false for null value", () => {
		expect.assertions(1);
		expect(isIterable(null)).toBe(false);
	});
	it("should be false for undefined", () => {
		expect.assertions(1);
		expect(isIterable()).toBe(false);
	});
	it("should be false for true boolean value", () => {
		expect.assertions(1);
		expect(isIterable(true)).toBe(false);
	});
	it("should be false for false boolean value", () => {
		expect.assertions(1);
		expect(isIterable(false)).toBe(false);
	});
	it("should be false for number value", () => {
		expect.assertions(1);
		expect(isIterable(1)).toBe(false);
	});
	it("should be false for POJO value", () => {
		expect.assertions(1);
		expect(isIterable({ test: 1, best: "4asgfag" })).toBe(false);
	});
});
