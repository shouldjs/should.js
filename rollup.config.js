/*eslint-env node */
'use strict';

const nodeResolve = require('rollup-plugin-node-resolve');

const pkg = require('./package.json');

const banner = `/*!
 * ${pkg.name} - ${pkg.description}
 * @version v${pkg.version}
 * @author ${pkg.author}
 * @link ${pkg.homepage}
 * @license ${pkg.license}
 */
`;

const outro = `
if (typeof define === 'function' && define.amd) {
  define([], function() { return should });
} else if (typeof module === 'object' && module.exports) {
  module.exports = should;
} else {
  this.Should = should;

  Object.defineProperty(this, 'should', {
    enumerable: false,
    configurable: true,
    value: should
  });
}`;

module.exports = {
  entry: 'browser-entry.js',
  banner,
  outro,
  format: 'iife',
  plugins: [
    nodeResolve({
      jsnext: true,
      main: true,
      preferBuiltins: false
    })
  ]
};
