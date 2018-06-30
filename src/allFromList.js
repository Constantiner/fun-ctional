import extractArguments from "./util/extractArguments";

export default fn => async (...values) =>
	Promise.all(
		extractArguments(values.length === 1 ? await Promise.resolve(values) : values).map(val =>
			Promise.resolve(val).then(fn)
		)
	);
