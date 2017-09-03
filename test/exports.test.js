var assert = require("assert");

// should global
assert(typeof global.should === "function");

var should = require("../cjs/should");

// should default export
assert(typeof should === "function");
assert(typeof should.Assertion === "function");
