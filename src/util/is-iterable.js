export default obj => (obj || obj === "") && typeof obj[Symbol.iterator] === "function";
