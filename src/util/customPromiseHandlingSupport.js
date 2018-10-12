const customPromiseHandlingSupportSupport = Symbol("Custom Promise Handling Support");

const addCustomPromiseHandlingSupport = (fn, customVersion) => (
	(fn[customPromiseHandlingSupportSupport] = customVersion), fn
);

const supportsCustomPromiseHandling = fn => fn[customPromiseHandlingSupportSupport];

export { addCustomPromiseHandlingSupport, supportsCustomPromiseHandling };
