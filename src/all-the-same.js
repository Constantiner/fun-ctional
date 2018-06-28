import isIterable from "./util/is-iterable";
const getFunctions = fns => (fns.length === 1 && isIterable(fns[0]) ? fns[0] : fns);
export default (...fns) => value => Promise.all(getFunctions(fns).map(fn => Promise.resolve(value).then(fn)));
