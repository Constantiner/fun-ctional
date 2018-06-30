import isIterable from "./util/is-iterable";
const getFunctions = fns => (fns.length === 1 && isIterable(fns[0]) ? Array.from(fns[0]) : fns);
export default (...fns) => async value => {
	const val = await Promise.resolve(value);
	return Promise.all(getFunctions(fns).map(fn => Promise.resolve(val).then(fn)));
};
