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
const banner = `/**
* ${pkg.name}
* ${pkg.description}
* 
* @author ${pkg.author.name} <${pkg.author.email}>
* @version v${pkg.version}
* @link ${pkg.homepage}
* @license ${pkg.license}
*/

`;

gulp.task("clean", () => del(["dist", "*.js", "*.mjs", "*.map", "!gulpfile.js", "!babel.config.js"]));

const getSourceFile = () => gulp.src(SOURCES),
	getDestination = () => gulp.dest("."),
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
	),
	proceedEs6Modules = () =>
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
			.pipe(getDestination())
			.pipe(rename({ extname: `.mjs` }))
			.pipe(getDestination());

gulp.task("es6modules", () => proceedEs6Modules());

gulp.task("es5modules", () =>
	getSourceFile()
		.pipe(sourcemaps.init())
		.pipe(rollupUmd)
		.pipe(
			rename({
				extname: ".js",
				suffix: "-umd"
			})
		)
		.pipe(sourcemaps.write("."))
		.pipe(getDestination())
);

gulp.task("es5modulesMin", () =>
	getSourceFile()
		.pipe(sourcemaps.init())
		.pipe(rollupUmd)
		.pipe(uglify())
		.pipe(
			rename({
				extname: ".min.js",
				suffix: "-umd"
			})
		)
		.pipe(sourcemaps.write("."))
		.pipe(getDestination())
);

gulp.task("scripts", gulp.series("es5modulesMin", "es5modules", "es6modules"));

gulp.task("default", gulp.series("clean", "scripts"));
