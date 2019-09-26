import { exec as childProcessExec } from "child_process";
import { promisify } from "util";

const exec = promisify(childProcessExec);
const { version } = require("../package.json");

const generateChangelog = async () => {
	// const { stdout, stderr } = await exec(`github_changelog_generator --future-release v${version}`);
	const command = `docker run --rm -v "$(pwd)":/usr/local/src/your-app -e CHANGELOG_GITHUB_TOKEN='${process.env.CHANGELOG_GITHUB_TOKEN}' ferrarimarco/github-changelog-generator --user Constantiner --project fun-ctional --future-release v${version} --header="---\nid: CHANGELOG\ntitle: Changelog\nsidebar_label: Changelog\n---"`;
	const { stdout, stderr } = await exec(command);
	// eslint-disable-next-line no-console
	console.log(stdout);
	// eslint-disable-next-line no-console
	console.error(stderr);
};

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on("unhandledRejection", error => {
	throw error;
});

generateChangelog();
