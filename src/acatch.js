export default catchFn => value => Promise.resolve(value).catch(catchFn);
