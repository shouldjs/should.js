var err = require("../util").err;

describe("string", function() {
  it("test startWith()", function() {
    "foobar".should.startWith("foo");
    "foobar".should.not.startWith("bar");

    err(function() {
      "foobar".should.startWith("bar");
    }, "expected 'foobar' to start with 'bar'");

    err(function() {
      "foobar".should.not.startWith("foo");
    }, "expected 'foobar' not to start with 'foo' (false negative fail)");

    err(function() {
      "foobar".should.startWith("bar", "baz");
    }, "baz");

    err(function() {
      "foobar".should.not.startWith("foo", "baz");
    }, "baz");
  });

  it("test endWith()", function() {
    "foobar".should.endWith("bar");
    "foobar".should.not.endWith("foo");

    err(function() {
      "foobar".should.endWith("foo");
    }, "expected 'foobar' to end with 'foo'");

    err(function() {
      "foobar".should.not.endWith("bar");
    }, "expected 'foobar' not to end with 'bar' (false negative fail)");

    err(function() {
      "foobar".should.endWith("foo", "baz");
    }, "baz");

    err(function() {
      "foobar".should.not.endWith("bar", "baz");
    }, "baz");
  });
});
