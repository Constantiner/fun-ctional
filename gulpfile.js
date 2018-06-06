const gulp = require("gulp");
const rename = require("gulp-rename");
const header = require("gulp-header");
const pkg = require("./package.json");
const banner = `/**
 * <%= pkg.name %> - <%= pkg.description %>
 * 
 * @author <%= pkg.author %>
 * @version v<%= pkg.version %>
 * @link <%= pkg.homepage %>
 * @license <%= pkg.license %>
 */

`;
const babel = require("gulp-babel");
const del = require("del");
const sourcemaps = require("gulp-sourcemaps");
const concat = require("gulp-concat");
const MAIN_FILE_NAME = "fun-ctional";
const BROWSERS = [">0.25%", "not ie 11", "not op_mini all"];
const BABEL_PLUGINS = ["transform-es2015-modules-umd"];

gulp.task("clean", () => del(["dist"]));

const getSourceFile = () => gulp.src("src/**/*.js"),
	getBanner = () => header(banner, { pkg }),
	getDest = () => gulp.dest("./dist/");

gulp.task("mainEs6module", () =>
	getSourceFile()
		.pipe(concat(`${MAIN_FILE_NAME}.mjs`))
		.pipe(getBanner())
		.pipe(getDest())
);

gulp.task("es6modules", () =>
	getSourceFile()
		.pipe(getBanner())
		.pipe(rename({ extname: ".mjs" }))
		.pipe(getDest())
);

gulp.task("mainEs5umd", () =>
	getSourceFile()
		.pipe(concat(`${MAIN_FILE_NAME}.js`))
		.pipe(sourcemaps.init())
		.pipe(
			babel({
				presets: [
					[
						"env",
						{
							targets: {
								browsers: BROWSERS
							}
						}
					]
				],
				plugins: BABEL_PLUGINS
			})
		)
		.pipe(getBanner())
		.pipe(sourcemaps.write("."))
		.pipe(getDest())
);

gulp.task("es5umds", () =>
	getSourceFile()
		.pipe(sourcemaps.init())
		.pipe(
			babel({
				presets: [
					[
						"env",
						{
							targets: {
								browsers: BROWSERS
							}
						}
					]
				],
				plugins: BABEL_PLUGINS
			})
		)
		.pipe(getBanner())
		.pipe(sourcemaps.write("."))
		.pipe(getDest())
);

gulp.task("scripts", () => gulp.start("mainEs6module", "mainEs5umd", "es6modules", "es5umds"));

gulp.task("default", ["clean"], () => gulp.start("scripts"));
