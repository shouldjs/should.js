var err = require("../util").err;

describe("bool", function() {
  it("test true", function() {
    true.should.be.true();
    false.should.not.be.true();
    (1).should.not.be.true();

    err(function() {
      "test".should.be.true();
    }, "expected 'test' to be true");

    err(function() {
      true.should.not.be.true();
    }, "expected true not to be true (false negative fail)");

    err(function() {
      false.should.be.true("My text");
    }, "My text");
  });

  it("test false", function() {
    false.should.be.false();
    true.should.not.be.false();
    (0).should.not.be.false();

    err(function() {
      "".should.be.false();
    }, "expected '' to be false");

    err(function() {
      false.should.not.be.false();
    }, "expected false not to be false (false negative fail)");

    err(function() {
      true.should.be.false("My text");
    }, "My text");
  });

  it("test ok", function() {
    true.should.be.ok();
    false.should.not.be.ok();
    (1).should.be.ok();
    (0).should.not.be.ok();

    err(function() {
      "".should.be.ok();
    }, "expected '' to be truthy");

    err(function() {
      "test".should.not.be.ok();
    }, "expected 'test' not to be truthy (false negative fail)");

    err(function() {
      "hello".should.be.ok(true);
    }, "This assertion does not expect any arguments. You may need to check your code");
  });

  it("test truthy", function() {
    true.should.be.truthy();
    false.should.not.be.truthy();
    (1).should.be.truthy();
    (0).should.not.be.truthy();
    ({}).should.be.truthy();
    (function() {}).should.be.truthy();

    err(function() {
      "".should.be.truthy();
    }, "expected '' to be truthy");

    err(function() {
      "test".should.not.be.truthy();
    }, "expected 'test' not to be truthy (false negative fail)");

    err(function() {
      "hello".should.be.truthy(true);
    }, "This assertion does not expect any arguments. You may need to check your code");
  });

  it("test falsy", function() {
    true.should.not.be.falsy();
    false.should.be.falsy();
    (1).should.not.be.falsy();
    (0).should.be.falsy();
    ({}).should.not.be.falsy();
    (function() {}).should.not.be.falsy();

    err(function() {
      "".should.not.be.falsy();
    }, "expected '' not to be falsy (false negative fail)");

    err(function() {
      "test".should.be.falsy();
    }, "expected 'test' to be falsy");

    err(function() {
      "".should.be.falsy(false);
    }, "This assertion does not expect any arguments. You may need to check your code");
  });
});
