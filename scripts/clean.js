import del from "del";

const clean = async () => del(["*.js", "*.mjs", "*.map", "!gulpfile.js", "!babel.config.js", "!rollup.config.js"]);

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on("unhandledRejection", error => {
	throw error;
});

clean();
