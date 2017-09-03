/**
 * Module dependencies.
 */

function err(fn, msg) {
  try {
    fn();
    should.fail("expected an error");
  } catch (err) {
    should.equal(msg, err.message);
  }
}

function err_should_exist(obj) {
  err(function() {
    should.exist(obj);
  }, "expected " + should.format(obj) + " to exist");
}

function err_should_not_exist(obj) {
  err(function() {
    should.not.exist(obj);
  }, "expected " + should.format(obj) + " to not exist");
}

describe("exist", function() {
  // static should.exist() pass,
  it("test static should.exist() pass w/ bool", function() {
    should.exist(false);
  });

  it("test static should.exist() pass w/ number", function() {
    should.exist(0);
  });

  it("test static should.exist() pass w/ string", function() {
    should.exist("");
  });

  it("test static should.exist() pass w/ object", function() {
    should.exist({});
  });

  it("test static should.exist() pass w/ array", function() {
    should.exist([]);
  });

  // static should.exist() fail,
  it("test static should.exist() fail w/ null", function() {
    err_should_exist(null);
  });

  it("test static should.exist() fail w/ undefined", function() {
    err_should_exist(undefined);
  });

  // static should.not.exist() pass,
  it("test static should.not.exist() pass w/ null", function() {
    should.not.exist(null);
  });

  it("test static should.not.exist() pass w/ undefined", function() {
    should.not.exist(undefined);
  });

  // static should.not.exist() fail,
  it("test static should.not.exist() fail w/ bool", function() {
    err_should_not_exist(false);
  });

  it("test static should.not.exist() fail w/ number", function() {
    err_should_not_exist(0);
  });

  it("test static should.not.exist() fail w/ string", function() {
    err_should_not_exist("");
  });

  it("test static should.not.exist() fail w/ object", function() {
    err_should_not_exist({});
  });

  it("test static should.not.exist() fail w/ array", function() {
    err_should_not_exist([]);
  });
});
