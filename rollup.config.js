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

module.exports = {
  entry: 'browser-entry.js',
  banner,
  format: 'iife',
  plugins: [
    nodeResolve({
      jsnext: true,
      main: true,
      preferBuiltins: false
    })
  ],
  external: ['root'],
  globals: {
    root: 'this'
  }
};
