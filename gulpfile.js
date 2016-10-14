'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var postcss = require('gulp-postcss');
var browserslist = require('browserslist');
var autoprefixer = require('autoprefixer');
var cssnano = require('cssnano');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var md5 = require("gulp-md5-assets");
var inline_base64 = require('gulp-inline-base64');
var sorting = require('postcss-sorting');
var sortingConfig = require('./node_modules/postcss-sorting-config-wildbit/scss-sorting.json');
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
    .pipe(inline_base64({
      baseDir: './html',
      maxSize: 1.5 * 1024
    }))
    .pipe(postcss([
      cssnano({
        safe: true,
        autoprefixer: false,       // Run on its own
        discardDuplicates: false   // Extremely slow
      })
    ]))
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


// Bust cache

gulp.task('cachebust:images', ['styles:sass'], function () {
  return gulp.src(paths.images.dist + '**/*')
    .pipe(md5(10, paths.styles.dist + '**/*.css'));
});

// Clean up SCSS

gulp.task('cleanup', function () {
  return gulp.src([
      paths.styles.src + '**/*.scss'
    ])
    .pipe(
      postcss(
        [
          sorting(sortingConfig)
        ],
        {
          syntax: require('postcss-scss')
        }
      )
    )
    .pipe(gulp.dest(paths.styles.src));
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
  'cachebust:images',
  'scripts:landing'
]);

gulp.task('production', ['default', 'cachebust:css']);
gulp.task('development', ['default', 'watch']);
