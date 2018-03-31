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

  it("test contain()", function() {
    "foobar".should.contain("oob");
    "foobar".should.not.contain("foobi");

    err(function() {
      "foobar".should.contain("boo");
    }, "expected 'foobar' to contain 'boo'");

    err(function() {
      "foobar".should.not.contain("bar");
    }, "expected 'foobar' not to contain 'bar' (false negative fail)");

    err(function() {
      "foobar".should.contain("oooo", "baz");
    }, "baz");

    err(function() {
      "foobar".should.not.contain("oob", "baz");
    }, "baz");
  });
});
