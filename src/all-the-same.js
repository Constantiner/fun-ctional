import getFunctions from "./util/get-functions";
export default (...fns) => async value => {
	const val = await Promise.resolve(value);
	return Promise.all(getFunctions(fns).map(fn => Promise.resolve(val).then(fn)));
};
