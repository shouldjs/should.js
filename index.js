var should = require("./cjs/should");

var defaultProto = Object.prototype;
var defaultProperty = "should";

//Expose api via `Object#should`.
try {
  var prevShould = should.extend(defaultProperty, defaultProto);
  should._prevShould = prevShould;

  Object.defineProperty(global, "should", {
    enumerable: false,
    configurable: true,
    value: should
  });
} catch (e) {
  //ignore errors
}

module.exports = should;
