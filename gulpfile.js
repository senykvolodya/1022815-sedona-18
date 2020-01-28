"use strict";

var gulp = require("gulp");
var plumber = require("gulp-plumber");
var sourcemap = require("gulp-sourcemaps");
var sass = require("gulp-sass");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var svgstore = require('gulp-svgstore');
var del = require('del');
var csso = require("gulp-csso");
var rename = require("gulp-rename");
var imagemin = require("gulp-imagemin");
var webp = require("gulp-webp");
var uglify = require("gulp-uglify");
var pipeline = require('readable-stream').pipeline;
var htmlmin = require("gulp-htmlmin");
var server = require("browser-sync").create();

gulp.task("css", function () {
  return gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(csso())
    .pipe(rename("style.min.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/css"))
    .pipe(server.stream());
});

gulp.task("minjs", function () {
  return pipeline(
    gulp.src("source/js/script.js"),
    uglify(),
    rename("script.min.js"),
    gulp.dest("build/js")
  );
});

gulp.task("minifyhtml", function() {
  return gulp.src('source/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest("build"));
});


gulp.task("sprite", function () {
  return gulp
    .src("source/img/sprite/**/*.svg")
    .pipe(svgstore({inlineSvg: true}))
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("build/img"));
});

gulp.task("copy", function () {
  return gulp.src([
    "source/fonts/**/*.{woff,woff2}",
    // "source/img/**",
    "source/js/plugins/**",
    "source/*.ico"
  ], {
    base: "source"
  })
    .pipe(gulp.dest("build"));
});

gulp.task("images", function () {
  return gulp.src(["source/img/**/*.{png,jpg,svg}", "!source/img/sprite"])
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.mozjpeg({quality: 75, progressive: true}),
      imagemin.svgo()
    ]))
    .pipe(gulp.dest("build/img"));
});

gulp.task("webp", function () {
  return gulp.src("source/img/**/*.{png,jpg}")
    .pipe(webp({quality: 90}))
    .pipe(gulp.dest("build/img"));
});

gulp.task("clean", function () {
  return del("build");
});

gulp.task("server", function () {
  server.init({
    server: "build/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("source/sass/**/*.{scss,sass}", gulp.series("css"));
  gulp.watch("source/img/**/*.svg", gulp.series("sprite", "minifyhtml", "refresh"));
  gulp.watch("source/*.html", gulp.series("minifyhtml", "refresh"));
  gulp.watch("source/js/script.js", gulp.series("minjs", "refresh"));
});

gulp.task("refresh", function (done) {
  server.reload();
  done();
});

gulp.task("build", gulp.series(
  "clean",
  "copy",
  "css",
  "sprite",
  "webp",
  "images",
  "minjs",
  "minifyhtml"
));
gulp.task("start", gulp.series("build", "server"));
