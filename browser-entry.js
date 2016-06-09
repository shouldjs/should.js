import should from './es6/should';
import root from 'root';

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
  root.Should = should;

  Object.defineProperty(root, 'should', {
    enumerable: false,
    configurable: true,
    value: should
  });
}
