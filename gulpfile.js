'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var browserSync = require('browser-sync');
var plumber = require('gulp-plumber');
var reload = browserSync.reload;

var paths = {
  scripts: {
    src:  './html/src/javascripts/',
    dist: './html/javascripts/'
  },
  styles: {
    src:  './html/src/stylesheets/',
    dist: './html/stylesheets/'
  }
};


// Stylesheets

gulp.task('styles:sass', function () {
  return gulp.src(paths.styles.src + '**/*.scss')
    .pipe(plumber(function (err) {
      this.emit('end');
      this.destroy();
    }))
    .pipe(sass({
        precision: 5
    }))
    .pipe(gulp.dest(paths.styles.dist))
    .pipe(reload({stream: true}));
});


// Scripts

gulp.task('scripts:landing', function () {
  return gulp.src([
    paths.scripts.src + 'vendor/modernizr.js',
    require.resolve('fontfaceobserver/fontfaceobserver.js'), // Use a version with bundled Promise polyfill
    require.resolve('fg-cookie'),
    paths.scripts.src + 'font-loader.js',
    paths.scripts.src + 'vendor/prism.min.js',

    paths.scripts.src + 'helpers.js',
    paths.scripts.src + 'support.js',
    paths.scripts.src + 'WORK_HERE.js'
  ])
    .pipe(concat('landing.js'))
    .pipe(gulp.dest(paths.scripts.dist))
    .pipe(reload({stream: true}));
});


// Watch & Default

gulp.task('watch', function () {
  browserSync({
    server: './html'
  });
  gulp.watch('html/*.html').on('change', browserSync.reload);
  gulp.watch(paths.styles.src  + '**/*.scss', ['styles:sass']);
  gulp.watch(paths.scripts.src + '**/*.js', ['scripts:landing']);
});

gulp.task('default', [
  'styles:sass',
  'scripts:landing'
]);

gulp.task('development', ['default', 'watch']);
