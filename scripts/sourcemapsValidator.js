/* eslint-disable no-console */
import assert from "assert";
import { readFileSync } from "fs";
import globby from "globby";
import validate from "sourcemap-validator";

const getMapFilesList = () => globby(["**/*.map", "!node_modules"]);

const validateSourcemaps = (sourceFileName, sourceMapFileName) => {
	console.log(`Validating source map for "${sourceFileName}"…`);
	const source = readFileSync(sourceFileName, "utf-8");
	const sourceMap = readFileSync(sourceMapFileName, "utf-8");
	assert.doesNotThrow(() => {
		validate(source, sourceMap);
	}, `The sourcemap is not valid "${sourceMapFileName}"`);
};

const checkSourceMaps = async () => {
	const mapFiles = await getMapFilesList();
	mapFiles.forEach(mapFile => {
		const sourceFile = mapFile
			.split(".")
			.slice(0, -1)
			.join(".");
		validateSourcemaps(sourceFile, mapFile);
	});
	console.log("All source maps are valid");
};

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on("unhandledRejection", error => {
	throw error;
});

checkSourceMaps();
