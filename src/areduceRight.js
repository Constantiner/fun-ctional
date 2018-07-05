import { extractResolvedArguments } from "./util/extractArguments";
import { getReducerArgs } from "./util/reducer";

export default (...args) => async (...values) =>
	Array.prototype.reduceRight.apply(await extractResolvedArguments(values), getReducerArgs(args));
