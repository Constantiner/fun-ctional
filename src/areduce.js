import { extractResolvedArguments } from "./util/extractArguments";
import { getReducerArgs } from "./util/reducer";

export default (...args) => async (...values) =>
	Array.prototype.reduce.apply(await extractResolvedArguments(values), getReducerArgs(args));
