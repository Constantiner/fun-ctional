import getFunctions from "./util/getFunctions";

export default (...fns) => async value => {
	const val = await Promise.resolve(value);
	return Promise.all(getFunctions(fns).map(fn => Promise.resolve(val).then(fn)));
};
