var gulp = require('gulp');

var header = require('gulp-header');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

var browserify = require('browserify');

var pkg = require('./package.json');

var banner = [
  '/*!',
  ' * <%= pkg.name %> - <%= pkg.description %>',
  ' * @version v<%= pkg.version %>',
  ' * @author <%= pkg.author %>',
  ' * @link <%= pkg.homepage %>',
  ' * @license <%= pkg.license %>',
  ' */',
  ''].join('\n');

gulp.task('script', function() {
  var bundleStream = browserify({
    entries: './browser-entry',
    builtins: null,
    insertGlobals: false,
    detectGlobals: false,
    fullPaths: false
  })
    .bundle();

  return bundleStream
    .pipe(source('should.js'))
    .pipe(buffer())
    .pipe(header(banner, {pkg: pkg}))
    .pipe(gulp.dest('./'))
    .pipe(uglify({ preserveComments: 'some' }))
    .pipe(rename('should.min.js'))
    .pipe(gulp.dest('./'));
});
