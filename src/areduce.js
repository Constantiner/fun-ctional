import { extractArrayFromArgument } from "./util/extractArguments";
import { getReducerArgs } from "./util/reducer";

export default (...args) => async iterable =>
	Array.prototype.reduce.apply(await extractArrayFromArgument(iterable), getReducerArgs(args));
