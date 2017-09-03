// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var assert = should;

var keys = Object.keys;

function makeBlock(f) {
  var args = Array.prototype.slice.call(arguments, 1);
  return function() {
    return f.apply(this, args);
  };
}

describe("assert", function() {
  it(".ok", function() {
    assert.throws(
      makeBlock(assert.ok, false),
      assert.AssertionError,
      "ok(false)"
    );

    assert.doesNotThrow(
      makeBlock(assert.ok, true),
      assert.AssertionError,
      "ok(true)"
    );

    assert.doesNotThrow(makeBlock(assert.ok, "test", "ok('test')"));

    assert.throws(
      makeBlock(assert.ok, false),
      assert.AssertionError,
      "ok(false)"
    );

    assert.doesNotThrow(
      makeBlock(assert.ok, true),
      assert.AssertionError,
      "ok(true)"
    );

    assert.doesNotThrow(makeBlock(assert.ok, "test"), "ok('test')");
  });

  it(".equal", function() {
    assert.throws(
      makeBlock(assert.equal, true, false),
      assert.AssertionError,
      "equal"
    );

    assert.doesNotThrow(makeBlock(assert.equal, null, null), "equal");

    assert.doesNotThrow(makeBlock(assert.equal, undefined, undefined), "equal");

    assert.doesNotThrow(makeBlock(assert.equal, null, undefined), "equal");

    assert.doesNotThrow(makeBlock(assert.equal, true, true), "equal");

    assert.doesNotThrow(makeBlock(assert.equal, 2, "2"), "equal");

    assert.doesNotThrow(makeBlock(assert.notEqual, true, false), "notEqual");

    assert.throws(
      makeBlock(assert.notEqual, true, true),
      assert.AssertionError,
      "notEqual"
    );
  });

  it(".strictEqual", function() {
    assert.throws(
      makeBlock(assert.strictEqual, 2, "2"),
      assert.AssertionError,
      "strictEqual"
    );

    assert.throws(
      makeBlock(assert.strictEqual, null, undefined),
      assert.AssertionError,
      "strictEqual"
    );

    assert.doesNotThrow(
      makeBlock(assert.notStrictEqual, 2, "2"),
      "notStrictEqual"
    );
  });

  it(".deepEqual - 7.2", function() {
    assert.doesNotThrow(
      makeBlock(assert.deepEqual, new Date(2000, 3, 14), new Date(2000, 3, 14)),
      "deepEqual date"
    );

    assert.throws(
      makeBlock(assert.deepEqual, new Date(), new Date(2000, 3, 14)),
      assert.AssertionError,
      "deepEqual date"
    );
  });

  it(".deepEqual - 7.3", function() {
    assert.doesNotThrow(makeBlock(assert.deepEqual, /a/, /a/));
    assert.doesNotThrow(makeBlock(assert.deepEqual, /a/g, /a/g));
    assert.doesNotThrow(makeBlock(assert.deepEqual, /a/i, /a/i));
    assert.doesNotThrow(makeBlock(assert.deepEqual, /a/m, /a/m));
    assert.doesNotThrow(makeBlock(assert.deepEqual, /a/gim, /a/gim));
    assert.throws(makeBlock(assert.deepEqual, /ab/, /a/));
    assert.throws(makeBlock(assert.deepEqual, /a/g, /a/));
    assert.throws(makeBlock(assert.deepEqual, /a/i, /a/));
    assert.throws(makeBlock(assert.deepEqual, /a/m, /a/));
    assert.throws(makeBlock(assert.deepEqual, /a/gim, /a/im));

    var re1 = /a/;
    re1.lastIndex = 3;
    assert.throws(makeBlock(assert.deepEqual, re1, /a/));
  });

  it(".deepEqual - 7.4", function() {
    assert.throws(makeBlock(assert.deepEqual, 4, "4"), "deepEqual == check");
    assert.throws(makeBlock(assert.deepEqual, true, 1), "deepEqual == check");
    assert.throws(
      makeBlock(assert.deepEqual, 4, "5"),
      assert.AssertionError,
      "deepEqual == check"
    );
  });

  it(".deepEqual - 7.5", function() {
    // having the same number of owned properties && the same set of keys
    assert.doesNotThrow(makeBlock(assert.deepEqual, { a: 4 }, { a: 4 }));
    assert.doesNotThrow(
      makeBlock(assert.deepEqual, { a: 4, b: "2" }, { a: 4, b: "2" })
    );
    assert.throws(makeBlock(assert.deepEqual, [4], ["4"]));
    assert.throws(
      makeBlock(assert.deepEqual, { a: 4 }, { a: 4, b: true }),
      assert.AssertionError
    );
    assert.throws(makeBlock(assert.deepEqual, ["a"], { 0: "a" }));
    //(although not necessarily the same order),
    assert.doesNotThrow(
      makeBlock(assert.deepEqual, { a: 4, b: "1" }, { b: "1", a: 4 })
    );
    var a1 = [1, 2, 3];
    var a2 = [1, 2, 3];
    a1.a = "test";
    a1.b = true;
    a2.b = true;
    a2.a = "test";
    assert.throws(
      makeBlock(assert.deepEqual, keys(a1), keys(a2)),
      assert.AssertionError
    );
    assert.doesNotThrow(makeBlock(assert.deepEqual, a1, a2));
  });

  it(".deepEqual - instances", function() {
    // having an identical prototype property
    var nbRoot = {
      toString: function() {
        return this.first + " " + this.last;
      }
    };

    function nameBuilder(first, last) {
      this.first = first;
      this.last = last;
      return this;
    }

    nameBuilder.prototype = nbRoot;

    function nameBuilder2(first, last) {
      this.first = first;
      this.last = last;
      return this;
    }

    nameBuilder2.prototype = nbRoot;

    var nb1 = new nameBuilder("Ryan", "Dahl");
    var nb2 = new nameBuilder2("Ryan", "Dahl");

    assert.doesNotThrow(makeBlock(assert.deepEqual, nb1, nb2));

    // assert working there only because nb2 prototype is Function - it really does not check prototypes
    nameBuilder2.prototype = Object;
    nb2 = new nameBuilder2("Ryan", "Dahl");
    assert.throws(makeBlock(assert.deepEqual, nb1, nb2), assert.AssertionError);

    // String literal + object blew up my implementation...
    assert.throws(makeBlock(assert.deepEqual, "a", {}), assert.AssertionError);
  });

  function thrower(errorConstructor) {
    throw new errorConstructor("test");
  }

  it("Testing the throwing", function() {
    makeBlock(thrower, assert.AssertionError);

    // the basic calls work
    assert.throws(
      makeBlock(thrower, assert.AssertionError),
      assert.AssertionError,
      "message"
    );
    assert.throws(
      makeBlock(thrower, assert.AssertionError),
      assert.AssertionError
    );
    assert.throws(makeBlock(thrower, assert.AssertionError));

    // if not passing an error, catch all.
    assert.throws(makeBlock(thrower, TypeError));

    // when passing a type, only catch errors of the appropriate type
    var threw = false;
    try {
      assert.throws(makeBlock(thrower, TypeError), assert.AssertionError);
    } catch (e) {
      threw = true;
      assert.ok(e instanceof TypeError, "type");
    }
    assert.equal(
      true,
      threw,
      "a.throws with an explicit error is eating extra errors",
      assert.AssertionError
    );
    threw = false;

    // doesNotThrow should pass through all errors
    try {
      assert.doesNotThrow(makeBlock(thrower, TypeError), assert.AssertionError);
    } catch (e) {
      threw = true;
      assert.ok(e instanceof TypeError);
    }
    assert.equal(
      true,
      threw,
      "a.doesNotThrow with an explicit error is eating extra errors"
    );

    // key difference is that throwing our correct error makes an assertion error
    try {
      assert.doesNotThrow(makeBlock(thrower, TypeError), TypeError);
    } catch (e) {
      threw = true;
      assert.ok(e instanceof assert.AssertionError);
    }
    assert.equal(
      true,
      threw,
      "a.doesNotThrow is not catching type matching errors"
    );
  });

  it(".ifError", function() {
    assert.throws(function() {
      assert.ifError(new Error("test error"));
    });
    assert.doesNotThrow(function() {
      assert.ifError(null);
    });
    assert.doesNotThrow(function() {
      assert.ifError();
    });
  });

  it("make sure that validating using constructor really works", function() {
    var threw = false;
    try {
      assert.throws(function() {
        throw {};
      }, Array);
    } catch (e) {
      threw = true;
    }
    assert.ok(threw, "wrong constructor validation");
  });

  it(" use a RegExp to validate error message", function() {
    assert.throws(makeBlock(thrower, TypeError), /test/);
  });

  it("se a fn to validate error object", function() {
    assert.throws(makeBlock(thrower, TypeError), function(err) {
      if (err instanceof TypeError && /test/.test(err)) {
        return true;
      }
    });
  });

  it("Make sure deepEqual doesn't loop forever on circular refs", function() {
    var b = {};
    b.b = b;

    var c = {};
    c.b = c;

    var gotError = false;
    try {
      assert.deepEqual(b, c);
    } catch (e) {
      gotError = true;
    }

    assert.ok(!gotError);
  });

  it("test assertion message", function() {
    function testAssertionMessage(actual, expected) {
      try {
        assert.equal(actual, "");
      } catch (e) {
        assert.equal(
          e.toString(),
          ["AssertionError: expected", expected, "==", "''"].join(" ")
        );
      }
    }

    testAssertionMessage(undefined, "undefined");
    testAssertionMessage(null, "null");
    testAssertionMessage(true, "true");
    testAssertionMessage(false, "false");
    testAssertionMessage(0, "0");
    testAssertionMessage(100, "100");
    testAssertionMessage(NaN, "NaN");
    testAssertionMessage(Infinity, "Infinity");
    testAssertionMessage(-Infinity, "-Infinity");
    testAssertionMessage("", '""');
    testAssertionMessage("foo", "'foo'");
    testAssertionMessage([], "Array []");
    testAssertionMessage([1, 2, 3], "Array [ 1, 2, 3 ]");
    testAssertionMessage(/a/, "/a/");
    testAssertionMessage(function f() {}, "Function { name: 'f' }");
    testAssertionMessage({}, "Object {}");
    testAssertionMessage(
      { a: undefined, b: null },
      "Object { a: undefined, b: null }"
    );
    testAssertionMessage(
      { a: NaN, b: Infinity, c: -Infinity },
      "Object { a: NaN, b: Infinity, c: -Infinity }"
    );
  });

  it("regressions from node.js testcase", function() {
    var threw = false;

    try {
      assert.throws(function() {
        assert.ifError(null);
      });
    } catch (e) {
      threw = true;
      assert.equal(e.message, "Missing expected exception..");
    }
    assert.ok(threw);

    try {
      assert.equal(1, 2);
    } catch (e) {
      assert.equal(
        e.toString().split("\n")[0],
        "AssertionError: expected 1 == 2"
      );
    }

    try {
      assert.equal(1, 2, "oh no");
    } catch (e) {
      assert.equal(e.toString().split("\n")[0], "AssertionError: oh no");
    }
  });
});
