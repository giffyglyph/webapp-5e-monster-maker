'use strict';

let gulp = require('gulp');
let path = require('path');
let using = require('gulp-using');
let app = require('./package.json');
const babelify = require('babelify');
let browserify = require('browserify');
const source = require("vinyl-source-stream");
const buffer = require("vinyl-buffer");
const uglify = require("gulp-uglify");
let sourcemaps = require('gulp-sourcemaps');
let sass = require('gulp-sass');
let rename = require('gulp-rename');
var exec = require('child_process').exec;
let del = require('del');

/*
 * Purge all build content.
 */
gulp.task('purge', function (cb) {
	return del(path.resolve("dist"));
});

/*
 * Deploy all relevant images to the dist folder.
 */
gulp.task('build-images', function (cb) {
	return gulp.src(
			path.join("src", "images", "**", "*.+(jpg|jpeg|gif|png|svg|ico)"),
			{ base: path.join("src", "images") }
		)
		.pipe(using())
		.pipe(gulp.dest(path.join('dist', 'images')));
});

/*
 * Deploy all relevant stylesheets to the dist folder.
 */
gulp.task('build-pages', function (cb) {
	return gulp.src(
			path.join("src", "pages", "**", "*.html"),
			{ base: path.join("src", "pages") }
		)
		.pipe(using())
		.pipe(gulp.dest(path.join('dist')));
});

/*
 * Deploy all relevant stylesheets to the dist folder.
 */
gulp.task('build-stylesheets', function (cb) {
	return gulp.src(
			path.join("src", "stylesheets", "**", "*.scss"),
			{ base: path.join("src", "stylesheets") }
		)
		.pipe(using())
		.pipe(sourcemaps.init())
		.pipe(sass())
		.pipe(sourcemaps.write())
		.pipe(rename(function (path) {
			path.basename += `_v${app.version.replace(/\./g, "_")}`;
		}))
		.pipe(gulp.dest(path.join('dist', 'stylesheets')));
});

/*
 * Build templates js from hbs files.
 */
gulp.task('build-templates', function (cb) {
  exec('handlebars "./src/templates" -f "./src/scripts/templates.js" --extension "hbs" -m', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
});

/*
 * Build templates js from hbs files.
 */
gulp.task('delete-templates', function (cb) {
    return del(path.resolve("src/scripts/templates.js"));
});

/*
 * Deploy all relevant scripts to the dist folder.
 */
gulp.task('build-scripts', gulp.series('build-templates', function (cb) {
	return browserify({
			entries: [`src/scripts/monstermaker.js`],
			transform: [babelify.configure({ presets: ["@babel/preset-env"] })],
			standalone: "MonsterMaker"
		})
		.bundle()
		.pipe(source(`monstermaker_v${app.version.replace(/\./g, "_")}.js`))
		.pipe(buffer())
		.pipe(sourcemaps.init())
		.pipe(uglify())
		.pipe(gulp.dest(`dist/scripts`));
}, 'delete-templates'));

/*
 * Watch folders for any changes.
 */
gulp.task('watch', function(cb) {
	gulp.watch('src/images/**/*.+(jpg|jpeg|gif|png|svg|ico)', gulp.series(['build-images']));
	gulp.watch('src/pages/**/*.html', gulp.series(['build-pages']));
	gulp.watch('src/scripts/**/*.js', gulp.series(['build-scripts']));
	gulp.watch('src/templates/**/*.hbs', gulp.series(['build-scripts']));
	gulp.watch('src/stylesheets/**/*.scss', gulp.series(['build-stylesheets']));
});

/*
 * Master build tasks.
 */
gulp.task('build', gulp.series('purge', gulp.parallel('build-images', 'build-scripts', 'build-stylesheets', 'build-pages'), function(cb) {
	return cb();
}));
gulp.task('build-and-watch', gulp.series('build', 'watch'));
