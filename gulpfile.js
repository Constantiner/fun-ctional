const gulp = require("gulp");
const rename = require("gulp-rename");
const pkg = require("./package.json");
const babel = require("rollup-plugin-babel");
const del = require("del");
const sourcemaps = require("gulp-sourcemaps");
const uglify = require("gulp-uglify");
const rollup = require("gulp-better-rollup");
const BROWSERS = [">0.25%", "not ie 11", "not op_mini all"];
const SOURCES = "src/*.js";
const ES6_BUNDLED_SOURCES = "*.mjs";
const banner = `/**
* ${pkg.name}
* ${pkg.description}
* 
* @author ${pkg.author}
* @version v${pkg.version}
* @link ${pkg.homepage}
* @license ${pkg.license}
*/

`;

gulp.task("clean", () => del(["dist", "*.js", "*.mjs", "*.map", "!gulpfile.js"]));

const getSourceFile = () => gulp.src(SOURCES),
	getEs6SourceFile = () => gulp.src(ES6_BUNDLED_SOURCES),
	getDest = () => gulp.dest("."),
	rollupUmd = rollup(
		{
			onwarn(warning) {
				if (warning.code === "THIS_IS_UNDEFINED") {
					return;
				}
				/* eslint-disable-next-line no-console */
				console.error(warning.message);
			},
			plugins: [
				babel({
					babelrc: false,
					presets: [
						[
							"@babel/preset-env",
							{
								targets: {
									browsers: BROWSERS
								},
								modules: false
							}
						]
					]
				})
			]
		},
		{
			format: "umd",
			banner
		}
	);

gulp.task("es6modules", () =>
	getSourceFile()
		.pipe(
			rollup(
				{},
				{
					format: "es",
					banner
				}
			)
		)
		.pipe(rename({ extname: ".mjs" }))
		.pipe(getDest())
);

gulp.task("es5modules", ["es6modules"], () =>
	getEs6SourceFile()
		.pipe(sourcemaps.init())
		.pipe(rollupUmd)
		.pipe(rename({ extname: ".js" }))
		.pipe(sourcemaps.write("."))
		.pipe(getDest())
);

gulp.task("es5modulesMin", ["es6modules"], () =>
	getEs6SourceFile()
		.pipe(sourcemaps.init())
		.pipe(rollupUmd)
		.pipe(uglify())
		.pipe(rename({ extname: ".min.js" }))
		.pipe(sourcemaps.write("."))
		.pipe(getDest())
);

gulp.task("scripts", () => gulp.start("es5modules", "es5modulesMin"));

gulp.task("default", ["clean"], () => gulp.start("scripts"));
