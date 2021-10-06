'use strict';

const gulp = require('gulp');
const plumber = require('gulp-plumber');
const sourcemap = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const server = require('browser-sync').create();
const csso = require('gulp-csso');
const rename = require('gulp-rename');
const terser = require('gulp-terser');
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const svgstore = require('gulp-svgstore');
const posthtml = require('gulp-posthtml');
const include = require('posthtml-include');
const del = require('del');

// Styles
gulp.task('css', function () {
  return gulp.src('source/sass/style.scss')
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(gulp.dest('source/css'))
    .pipe(gulp.dest('build/css'))
    .pipe(postcss([autoprefixer()]))
    .pipe(csso())
    .pipe(rename('style.min.css'))
    .pipe(sourcemap.write('.'))
    .pipe(gulp.dest('build/css'))
    .pipe(server.stream());
});

// Html
gulp.task('html', function () {
  return gulp.src('source/*.html')
    .pipe(posthtml([
      include()
    ]))
    .pipe(gulp.dest('build'));
});

// Scripts
gulp.task('scripts', function () {
  return gulp.src('source/js/script.js')
  .pipe(terser())
  .pipe(rename('script.min.js'))
  .pipe(gulp.dest('build/js'))
  .pipe(server.stream());
});

// Server and watcher
gulp.task('server', function () {
  server.init({
    server: 'build/',
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch('source/sass/**/*.{scss,sass}', gulp.series('css'));
  gulp.watch('source/img/icon-*.svg', gulp.series('sprite', 'html', 'refresh'));
  gulp.watch('source/*.html', gulp.series('html', 'refresh'));
});

// Reload
gulp.task('refresh', function (done) {
  server.reload();
  done();
});

// optimizeImages
gulp.task('optimizeImages', function () {
  return gulp.src('source/img/**/*.{png,jpg,svg}')
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.jpegtran({progressive: true}),
      imagemin.svgo()
    ]))

    .pipe(gulp.dest('build/img'));
});

// Webp
gulp.task('webp', function () {
  return gulp.src('source/img/**/*.{png,jpg}')
    .pipe(webp({quality: 90}))
    .pipe(gulp.dest('build/img'));
});

// Sprite
gulp.task('sprite', function () {
  return gulp.src('source/img/icons-sprite/*.svg')
    .pipe(svgstore({inlineSvg: true}))
    .pipe(rename('sprite.svg'))
    .pipe(gulp.dest('build/img'));
});

// Copy
gulp.task('copy', function () {
  return gulp.src([
    'source/fonts/**/*.{woff,woff2}',
    'source/img/**',
    'source/js/**',
    'source//*.ico'
  ], {
    base: 'source'
  })
  .pipe(gulp.dest('build'));
});

// Clean
gulp.task('clean', function () {
  return del('build');
});

gulp.task('build', gulp.series('clean', 'copy', 'css', 'sprite', 'html', 'scripts', 'optimizeImages', 'webp'));
gulp.task('start', gulp.series('build', 'server'));
