/* eslint-disable unicorn/no-nested-ternary */
// import { DEFAULT_EXTENSIONS } from "@babel/core";
import { format } from "date-fns";
import { readFileSync } from "fs";
import { sync as globby } from "globby";
// import babel from "rollup-plugin-babel";
import prettier from "rollup-plugin-prettier";
import sourcemaps from "rollup-plugin-sourcemaps";
import typescript from "rollup-plugin-typescript2";
import { uglify } from "rollup-plugin-uglify";

const getBuildDate = () => format(new Date(), "dd MMMM yyyy");
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

const getSourceFilesList = () => globby(["src/*.(t|j)s"]);
const getMainFileAsList = () => globby(["src/index.ts"]);
const getFileName = file =>
	file
		.split("/")
		.pop()
		.split(".")
		.slice(0, -1)
		.join(".");
const getOutput = (input, extension) => `${getFileName(input)}.${extension}`;
const getUmdFileName = file => {
	const fileName = getFileName(file);
	if (fileName === "index") {
		return "fun-ctional";
	}
	return fileName;
};
const getUmdOutput = (input, minified = false) => `${getUmdFileName(input)}${minified ? ".min" : ""}.js`;

const config = (format, folder, minified = false) => input => ({
	input,
	output: {
		file: `${folder ? folder + "/" : ""}${
			format === "umd" ? getUmdOutput(input, minified) : getOutput(input, "js")
		}`,
		format,
		sourcemap: true,
		sourcemapFile: `${folder ? folder + "/" : ""}${getOutput(input, "js")}.map`,
		strict: true,
		banner: getActualBanner(),
		name: format === "umd" ? "funCtional" : undefined
	},
	plugins:
		format === "umd"
			? minified
				? [
						typescript({
							typescript: require("typescript")
						}),
						// babel({
						// 	extensions: [...DEFAULT_EXTENSIONS, ".ts", ".tsx"]
						// }),
						uglify(),
						sourcemaps()
				  ]
				: process.env.CI
				? [
						typescript({
							typescript: require("typescript")
						}),
						// babel({
						// 	extensions: [...DEFAULT_EXTENSIONS, ".ts", ".tsx"]
						// }),
						sourcemaps()
				  ]
				: [
						typescript({
							typescript: require("typescript")
						}),
						// babel({
						// 	extensions: [...DEFAULT_EXTENSIONS, ".ts", ".tsx"]
						// }),
						prettier(),
						sourcemaps()
				  ]
			: process.env.CI
			? [
					typescript({
						typescript: require("typescript")
					}),
					sourcemaps()
			  ]
			: [
					typescript({
						typescript: require("typescript")
					}),
					prettier(),
					sourcemaps()
			  ]
});

const sourceFiles = getSourceFilesList();
const mainFileAsList = getMainFileAsList();

export default [
	...mainFileAsList.map(config("es", "esm")),
	...sourceFiles.map(config("cjs")),
	...sourceFiles.map(config("umd", "browser")),
	...sourceFiles.map(config("umd", "browser", true))
];
