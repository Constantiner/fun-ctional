import isIterable from "./is-iterable";
export default fns => (fns.length === 1 && isIterable(fns[0]) ? Array.from(fns[0]) : fns);
