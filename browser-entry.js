import should from './es6/should';
import * as root from 'root';

var defaultProto = Object.prototype;
var defaultProperty = 'should';

//Expose api via `Object#should`.
try {
  var prevShould = should.extend(defaultProperty, defaultProto);
  should._prevShould = prevShould;
} catch (e) {
  //ignore errors
}


if (typeof define === 'function' && define.amd) {
  define([], function() { return should });
} else if (typeof module === 'object' && module.exports) {
  module.exports = should;
} else {
  var _root = root;

  _root.Should = should;

  Object.defineProperty(_root, 'should', {
    enumerable: false,
    configurable: true,
    value: should
  });
}
