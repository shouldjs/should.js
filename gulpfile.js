var gulp = require('gulp');
var $ = require('gulp-load-plugins')({ lazy: false });

var source = require('vinyl-source-stream');
var browserify = require('browserify');
var glob = require('glob');

var path = require('path');

var pkg = require('./package.json');

var banner = ['/**',
' * <%= pkg.name %> - <%= pkg.description %>',
' * @version v<%= pkg.version %>',
' * @author <%= pkg.author %>',
' * @link <%= pkg.homepage %>',
' * @license <%= pkg.license %>',
' */',
''].join('\n');

gulp.task('tests', function() {
    return gulp.src(['test/**/*.test.js', '!test/ext/browser/**'], { read: false })
      .pipe($.mocha({
          reporter: 'mocha-better-spec-reporter'
      }));
});

gulp.task('script', function () {
    var bundleStream = browserify({
        entries: './lib/browser.js',
        builtins: ['util', 'assert']
    })
      .bundle({
          insertGlobals: false,
          detectGlobals: false
      });

    return bundleStream
      .pipe(source('should.js'))
      .pipe($.streamify($.header(banner, { pkg : pkg } )))
      .pipe(gulp.dest('./'))
      .pipe($.streamify($.uglify()))
      .pipe($.streamify($.header(banner, { pkg : pkg } )))
      .pipe($.rename('should.min.js'))
      .pipe(gulp.dest('./'));
});

gulp.task('browser-tests-clean', function() {
    gulp.src(['./test/runner/{client.js,mocha.css,mocha.js}'], { read: false }).pipe($.clean());
});

gulp.task('copy-mocha-files', function() {
    gulp.src(['./node_modules/mocha/mocha.js', './node_modules/mocha/mocha.css'])
      .pipe(gulp.dest('./test/runner/'));
});

gulp.task('build-browser-tests', function() {
    var bundleStream = browserify({
        entries: glob.sync('./test/**/*.test.js'),
        builtins: ['util', 'assert']
    });

    bundleStream
      .bundle({
          insertGlobals: false,
          detectGlobals: false
      })
      .pipe(source('client.js'))
      .pipe(gulp.dest('test/runner'));
});

gulp.task('browser-runner', function() {
    $.connect.server({
        root: './test/runner/'
    });
});

gulp.task('browser-tests', ['browser-tests-clean', 'copy-mocha-files', 'build-browser-tests', 'browser-runner']);

