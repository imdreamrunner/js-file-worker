const gulp = require('gulp');
const ts = require("gulp-typescript");
var merge2 = require("merge2");
var amdclean = require("gulp-amdclean");
var Server = require('karma').Server;
var webserver = require("gulp-webserver");

gulp.task('build-commonjs', () => {
  // Build CommonJS library.
  const tsProject = ts.createProject("tsconfig.json", {
    module: "commonjs"
  });
  const tsResult = tsProject.src().pipe(tsProject());
  return merge2([
    tsResult.js.pipe(gulp.dest("dist/commonjs")),
    tsResult.dts.pipe(gulp.dest("dist/commonjs"))
  ]);
});


gulp.task("build-amd", function () {
  // Build CommonJS library.
  var tsProject = ts.createProject("tsconfig.json", {
    module: "amd",
    outFile: "FileWorker.js"
  });
  var tsResult = tsProject.src().pipe(tsProject());
  return merge2([
    tsResult.js.pipe(gulp.dest("dist/amd")),
    tsResult.dts.pipe(gulp.dest("dist/amd"))
  ]);
});

gulp.task("build-browser", ["build-amd"], function () {
  // Build library for browser.
  return gulp
    .src(["dist/amd/FileWorker.js"])
    .pipe(amdclean.gulp({
      prefixMode: "standard",
      wrap: {
        // This string is prepended to the file
        start: ";(function(global) {\n",
        // This string is appended to the file
        end: "\nglobal.FileWorker=index.default;}(window));"
      }
    }))
    .pipe(gulp.dest("dist/browser"));
});

gulp.task('test', function (done) {
  new Server({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, function(errorCode) {
    if (errorCode !== 0) {
      process.exit(errorCode);
    }
    done();
  }).start();
});

gulp.task('test-watch', (done) => {
  new Server({
    configFile: __dirname + '/karma.conf.js'
  }, () => done()).start();
});

gulp.task("webserver", () => {
  gulp.src(".")
    .pipe(webserver({
      livereload: true,
      directoryListing: true,
      open: true
    }));
});

gulp.task('build', ['build-commonjs', 'build-browser']);

gulp.task('default', ['build']);