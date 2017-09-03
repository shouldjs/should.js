import should from "./should";

var defaultProto = Object.prototype;
var defaultProperty = "should";

var freeGlobal =
  typeof global == "object" && global && global.Object === Object && global;

/** Detect free variable `self`. */
var freeSelf =
  typeof self == "object" && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function("return this")();

//Expose api via `Object#should`.
try {
  var prevShould = should.extend(defaultProperty, defaultProto);
  should._prevShould = prevShould;

  Object.defineProperty(root, "should", {
    enumerable: false,
    configurable: true,
    value: should
  });
} catch (e) {
  //ignore errors
}

export default should;
