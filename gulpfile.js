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

gulp.task("clean", () => del(["dist"]));

const getSourceFile = () => gulp.src("src/**/*.js"),
	getBanner = () => header(banner, { pkg }),
	getDest = () => gulp.dest("./dist/");

gulp.task("es6module", () =>
	getSourceFile()
		.pipe(getBanner())
		.pipe(rename({ extname: ".mjs" }))
		.pipe(getDest())
);

gulp.task("es5umd", () =>
	getSourceFile()
		.pipe(sourcemaps.init())
		.pipe(
			babel({
				presets: [
					[
						"env",
						{
							targets: {
								browsers: [">0.25%", "not ie 11", "not op_mini all"]
							}
						}
					]
				],
				plugins: ["transform-es2015-modules-umd"]
			})
		)
		.pipe(getBanner())
		.pipe(sourcemaps.write("."))
		.pipe(getDest())
);

gulp.task("scripts", () => gulp.start("es6module", "es5umd"));

gulp.task("default", ["clean"], () => gulp.start("scripts"));
