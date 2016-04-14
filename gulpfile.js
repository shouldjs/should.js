'use strict';

const gulp = require('gulp');

const derequire = require('gulp-derequire');
const wrapper = require('gulp-wrapper');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');

const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');

const browserify = require('browserify');
const collapse = require('bundle-collapser');

const pkg = require('./package.json');

const template = require('lodash.template')

const header = template(`
/*!
 * <%= pkg.name %> - <%= pkg.description %>
 * @version v<%= pkg.version %>
 * @author <%= pkg.author %>
 * @link <%= pkg.homepage %>
 * @license <%= pkg.license %>
 */
 
;(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.Should = factory();

    Object.defineProperty(root, 'should', {
      enumerable: false,
      configurable: true,
      value: root.Should
    });
  }
}(this, function () {
  var should, require = null;
`, { variable: 'pkg' })(pkg);

var footer = `
  return should;
}));
`;

gulp.task('script', () => {
  var bundleStream = browserify({
    entries: './browser-entry',
    builtins: null,
    insertGlobals: false,
    detectGlobals: false,
    fullPaths: false,
    hasExports: false
  })
    .plugin('bundle-collapser/plugin')
    .bundle();

  return bundleStream
    .pipe(source('should.js'))
    .pipe(buffer())
    .pipe(derequire())
    .pipe(wrapper({
      header,
      footer
    }))
    .pipe(gulp.dest('./'))
    .pipe(uglify({ preserveComments: 'some' }))
    .pipe(rename('should.min.js'))
    .pipe(gulp.dest('./'));
});

gulp.task('default', ['script']);
