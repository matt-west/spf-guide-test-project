'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var browserslist = require('browserslist');
var autoprefixer = require('autoprefixer');
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
  },
  images: {
    src: './html/images/',
    dist: './html/images/'
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
    paths.scripts.src + 'disable-on-submit.js',
    paths.scripts.src + 'flip-card.js',
    paths.scripts.src + 'support.js',
    paths.scripts.src + 'tracking.js'
  ])
    .pipe(concat('landing.min.js'))
    .pipe(uglify())
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
