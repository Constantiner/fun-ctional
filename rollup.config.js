import { format } from "date-fns";
import { readFileSync } from "fs";
import sourcemaps from "rollup-plugin-sourcemaps";

const getBuildDate = () => format(new Date(), "DD MMMM YYYY");
const pkg = require("./package.json");

const getActualBanner = () => {
	const licenseText = readFileSync("./LICENSE", "utf-8");
	const banner = `/**
 * ${pkg.name}
 * ${pkg.description}
 * 
 * @author ${pkg.author.name} <${pkg.author.email}>
 * @version v${pkg.version}
 * @link ${pkg.homepage}
 * @date ${getBuildDate()}
 * 
${licenseText.replace(/^/gm, " * ")}
 */

`;
	return banner;
};

const config = extension => ({
	input: "src/fun-ctional.js",
	output: {
		file: `fun-ctional${extension}`,
		format: extension === ".mjs" ? "es" : "cjs",
		sourcemap: true,
		sourcemapFile: `fun-ctional${extension}.map`,
		strict: true,
		banner: getActualBanner()
	},
	plugins: [sourcemaps()]
});

export default [config(".js"), config(".mjs")];
