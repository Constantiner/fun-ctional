const customPromiseHandlingSupportSupport = Symbol.for("Custom Promise Handling Support");

const addCustomPromiseHandlingSupport = (fn, customVersion) => {
	// eslint-disable-next-line fp/no-mutation
	fn[customPromiseHandlingSupportSupport] = customVersion;
	return fn;
};

const supportsCustomPromiseHandling = fn => fn[customPromiseHandlingSupportSupport];

export { addCustomPromiseHandlingSupport, supportsCustomPromiseHandling };
