const CustomPromiseHandlingSupport: unique symbol = Symbol.for("Custom Promise Handling Support");

interface CustomPromiseHandlingSupported {
	[CustomPromiseHandlingSupport]: Function;
}

type CustomPromiseHandlingSupportedFunction = CustomPromiseHandlingSupported & Function;

const addCustomPromiseHandlingSupport = (
	fn: Function,
	customVersion: Function
): CustomPromiseHandlingSupportedFunction => {
	const customPromiseHandlingSupportedFunction: CustomPromiseHandlingSupportedFunction = <
		CustomPromiseHandlingSupportedFunction
	>fn;
	customPromiseHandlingSupportedFunction[CustomPromiseHandlingSupport] = customVersion;
	return customPromiseHandlingSupportedFunction;
};

const supportsCustomPromiseHandling = (fn: Function): fn is CustomPromiseHandlingSupportedFunction =>
	Object.getOwnPropertySymbols(fn).includes(CustomPromiseHandlingSupport);
const getCustomPromiseHandling = (fn: CustomPromiseHandlingSupported): Function => fn[CustomPromiseHandlingSupport];

export { addCustomPromiseHandlingSupport, supportsCustomPromiseHandling, getCustomPromiseHandling };
