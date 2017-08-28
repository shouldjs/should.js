import should from "./es6/should";
import * as root from "root";

var defaultProto = Object.prototype;
var defaultProperty = "should";

var _root = root;

//Expose api via `Object#should`.
try {
  var prevShould = should.extend(defaultProperty, defaultProto);
  should._prevShould = prevShould;

  Object.defineProperty(_root, "should", {
    enumerable: false,
    configurable: true,
    value: should
  });
} catch (e) {
  //ignore errors
}

if (typeof define === "function" && define.amd) {
  define([], function() {
    return should;
  });
} else if (typeof module === "object" && module.exports) {
  module.exports = should;
}
