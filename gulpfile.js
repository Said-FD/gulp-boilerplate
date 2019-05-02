// Project Watcher
const gulp = require('gulp'),
      watch = require('gulp-watch'),
      browserSync = require('browser-sync').create();

gulp.task('watch', function() {

  browserSync.init({
    notify: false,
    server: {
      baseDir: 'app',
      index: 'index.html'
    },
    port: 3001
  });

  watch('./app/**/*.html', function() {
    browserSync.reload();
  });

  watch('./app/assets/styles/**/*.css', function() {
    gulp.start('cssInject');
  });

  watch('./app/assets/scripts/**/*.js', function() {
    browserSync.reload();
  });
});

gulp.task('cssInject', ['styles'], function() {
  return gulp.src('./app/temp/style.css')
    .pipe(browserSync.stream());
});


// Styles Builder
const postcss = require('gulp-postcss'),
      hexrgba = require('postcss-hexrgba'),
      cssImport = require('postcss-import'),
      autoprefixer = require('autoprefixer');

gulp.task('styles', function() {
  return gulp.src('./app/assets/styles/style.css')
    .pipe(postcss([cssImport, hexrgba,
      autoprefixer({
        browsers: ['last 2 versions']
      })
    ]))
    .on('error', function(errorInfo) {
      console.log(errorInfo.toString());
      this.emit('end');
    })
    .pipe(gulp.dest('./app/temp'));
});


// SVG Sprite Builder
const svgmin = require('gulp-svgmin'),
      rename = require('gulp-rename'),
      replace = require('gulp-replace-path'),
      svgSprite = require('gulp-svg-sprites');

gulp.task('svg', function () {
  return gulp.src('./app/assets/images/icons/*.svg')
    .pipe(svgmin({ plugins: [{ removeTitle: true }] }))
    .pipe(svgSprite({ mode: 'defs', preview: false }))
    .pipe(replace(/\s{2}<defs>\s{7}/, '<defs>'))
    .pipe(replace(/width=\"\d+(\.\d+)?\"\sheight=\"\d+(\.\d+)?\"\s/g, ''))
    .pipe(replace(/\s{8}<svg/g, '    <symbol'))
    .pipe(replace(/><\/svg>\s{7}/g, '></symbol>'))
    .pipe(replace('position:absolute', 'display:none'))
    .pipe(rename('icons-sprite.svg'))
    .pipe(gulp.dest('./app/assets/images/sprites'));
});
