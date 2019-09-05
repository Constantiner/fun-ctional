import { getConfigFileSync } from "@constantiner/resolve-node-configs-hierarchy";
import childProcess from "child_process";
import jest from "jest";

const getJestConfigFile = jestConfigFile => {
	const configPath = jestConfigFile;
	return getConfigFileSync(configPath, true);
};

const getArgv = (jestConfigFile, runInBand, watch) => {
	const execSync = childProcess.execSync;
	let argv = process.argv.slice(2);

	function isInGitRepository() {
		try {
			execSync("git rev-parse --is-inside-work-tree", { stdio: "ignore" });
			return true;
		} catch (e) {
			return false;
		}
	}

	function isInMercurialRepository() {
		try {
			execSync("hg --cwd . root", { stdio: "ignore" });
			return true;
		} catch (e) {
			return false;
		}
	}

	// Watch unless on CI, in coverage mode, or explicitly running all tests
	if (watch && !process.env.CI && !argv.includes("--coverage") && !argv.includes("--watchAll")) {
		// https://github.com/facebook/create-react-app/issues/5210
		const hasSourceControl = isInGitRepository() || isInMercurialRepository();
		argv.push(hasSourceControl ? "--watch" : "--watchAll");
	}

	if (!argv.includes("--config")) {
		const configPath = getJestConfigFile(jestConfigFile);
		if (configPath) {
			argv.push("--config");
			argv.push(configPath);
		}
	}

	if (runInBand) {
		argv.push("--runInBand");
	}

	return argv;
};

const runJest = (jestConfigFile, runInBand = false, watch = true) => {
	const argv = getArgv(jestConfigFile, runInBand, watch);
	jest.run(argv);
};

export { runJest };
