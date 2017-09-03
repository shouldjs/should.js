var err = require("./util").err;

var a = 10;
var b = 11;

describe(".not", function() {
  it("should not throw when true", function() {
    a.should.be.exactly(a);
  });

  it("should throw when false", function() {
    err(function() {
      a.should.be.exactly(b);
    }, "expected 10 to be 11");
  });

  it("should throw when not true (false negative case)", function() {
    err(function() {
      a.should.not.be.exactly(a);
    }, "expected 10 not to be 10 (false negative fail)");
  });

  it("should not throw when not false", function() {
    a.should.not.be.exactly(b);
  });
});
