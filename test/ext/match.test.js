var err = require("../util").err;

describe("match", function() {
  it("test string match(regexp)", function() {
    "foobar".should.match(/^foo/);
    "foobar".should.not.match(/^bar/);

    err(function() {
      "foobar".should.match(/^bar/i);
    }, "expected 'foobar' to match /^bar/i");

    err(function() {
      "foobar".should.not.match(/^foo/i);
    }, "expected 'foobar' not to match /^foo/i (false negative fail)");

    err(function() {
      "foobar".should.match(/^bar/i, "foo");
    }, "foo");

    err(function() {
      "foobar".should.not.match(/^foo/i, "foo");
    }, "foo");
  });

  it("test object match(regexp)", function() {
    ({ a: "foo", c: "barfoo" }.should.match(/foo$/));

    ({ a: "a" }.should.not.match(/^http/));

    should(null).not.match(/bar/);

    // positive false
    err(function() {
      ({ a: "foo", c: "barfoo" }.should.not.match(/foo$/));
    }, "expected Object { a: 'foo', c: 'barfoo' } not to match /foo$/\n    matched properties: a, c (false negative fail)");

    // negative true
    err(function() {
      ({ a: "foo", c: "barfoo" }.should.match(/^foo$/));
    }, "expected Object { a: 'foo', c: 'barfoo' } to match /^foo$/\n    not matched properties: c ('barfoo')\n    matched properties: a");
  });

  it("test array match(regexp)", function() {
    ["a", "b", "c"].should.match(/[a-z]/);
    ["a", "b", "c"].should.not.match(/[d-z]/);

    err(function() {
      ["a", "b", "c"].should.not.match(/[a-z]/);
    }, "expected Array [ 'a', 'b', 'c' ] not to match /[a-z]/\n    matched properties: '0', '1', '2' (false negative fail)");

    err(function() {
      ["a", "b", "c"].should.match(/[d-z]/);
    }, "expected Array [ 'a', 'b', 'c' ] to match /[d-z]/\n    not matched properties: '0' ('a'), '1' ('b'), '2' ('c')");
  });

  it("test match(function)", function() {
    (5).should.match(function(n) {
      return n > 0;
    });

    (5).should.not.match(function(n) {
      return n < 0;
    });

    (5).should.not.match(function(it) {
      it.should.be.an.Array();
    });

    (5).should.match(function(it) {
      it.should.be.a.Number();
    });

    err(function() {
      (5).should.match(function(n) {
        return n < 0;
      });
    }, "expected 5 to match Function { name: '' }");

    err(function() {
      (5).should.match(function(it) {
        it.should.be.an.Array();
      });
    }, "expected 5 to match Function { name: '' }\n    expected 5 to be an array\n        expected 5 to have [[Class]] Array");

    err(function() {
      (5).should.not.match(function(it) {
        return it.should.be.a.Number();
      });
    }, "expected 5 not to match Function { name: '' } (false negative fail)");

    err(function() {
      (5).should.not.match(function(n) {
        return n > 0;
      });
    }, "expected 5 not to match Function { name: '' } (false negative fail)");
  });

  it("test match(object)", function() {
    ({ a: 10, b: "abc", c: { d: 10 }, d: 0 }.should.match({
      a: 10,
      b: /c$/,
      c: function(it) {
        return it.should.have.property("d", 10);
      }
    }));

    ({ nested: null }.should.not.match({ nested: { prop: /foo/ } }));

    [10, "abc", { d: 10 }, 0].should.match({
      "0": 10,
      "1": /c$/,
      "2": function(it) {
        return it.should.have.property("d", 10);
      }
    });

    [10, "abc", { d: 10 }, 0].should.match([
      10,
      /c$/,
      function(it) {
        return it.should.have.property("d", 10);
      }
    ]);

    var d = new Date();
    var ds = d.toString();

    d.should.not.match(ds);
    ds.should.not.match(d);

    ({
      a: new Date("2017-09-02"),
      b: 12
    }.should.not.match({
      a: new Date("2017-09-03"),
      b: 12
    }));

    err(function() {
      ({ a: 10, b: "abc", c: { d: 10 }, d: 0 }.should.match({
        a: 11,
        b: /c$/,
        c: function c(it) {
          return it.should.have.property("d", 10);
        }
      }));
    }, "expected Object { a: 10, b: 'abc', c: Object { d: 10 }, d: 0 } to match Object { a: 11, b: /c$/, c: Function { name: 'c' } }\n    not matched properties: a (10)\n    matched properties: b, c");

    err(function() {
      ({ a: 10, b: "abc", c: { d: 10 }, d: 0 }.should.not.match({
        a: 10,
        b: /c$/,
        c: function c(it) {
          return it.should.have.property("d", 10);
        }
      }));
    }, "expected Object { a: 10, b: 'abc', c: Object { d: 10 }, d: 0 } not to match Object { a: 10, b: /c$/, c: Function { name: 'c' } }\n    matched properties: a, b, c (false negative fail)");
  });

  it("test each property match(function)", function() {
    [10, 11, 12].should.matchEach(function(it) {
      return it >= 10;
    });

    [10, 10].should.matchEach(10);

    ({ a: 10, b: 11, c: 12 }.should.matchEach(function(value) {
      value.should.be.a.Number();
    }));

    ["a", "b", "c"].should.matchEach(/[a-c]/);

    err(function() {
      ["a", "b", "c"].should.not.matchEach(/[a-c]/);
    }, "expected Array [ 'a', 'b', 'c' ] not to match each /[a-c]/ (false negative fail)");

    err(function() {
      [10, 11].should.matchEach(10);
    }, "expected Array [ 10, 11 ] to match each 10\n    expected 11 to match 10");
  });

  it("test matchAny(obj)", function() {
    [{}, { nested: { prop: "foo" } }].should.matchAny({
      nested: { prop: "foo" }
    });

    [{ nested: undefined }, { nested: { prop: "foo" } }].should.matchAny({
      nested: { prop: /foo/ }
    });
  });

  it("test matchAny(function)", function() {
    [9, 10, 11].should.matchAny(function(it) {
      return it >= 10;
    });

    [9, 10, 11].should.not.matchAny(function(it) {
      return it == 2;
    });

    ({ a: 10, b: 11, c: 12 }.should.matchAny(function(value) {
      value.should.be.a.Number();
    }));

    ({ a: 10, b: "eleven", c: "twelve" }.should.matchAny(function(value) {
      value.should.be.a.Number();
    }));
  });

  it("test matchAny(number)", function() {
    [10, 11, 12].should.matchAny(10);

    [10, 10].should.matchAny(10);

    [10, 11, 12].should.not.matchAny(2);
  });

  it("test matchAny(regexp)", function() {
    ["a", "b", "c"].should.matchAny(/[a-b]/);

    ["a", "b", "c"].should.not.matchAny(/[d-f]/);

    err(function() {
      ["a", "b", "c"].should.not.matchAny(/[a-c]/);
    }, "expected Array [ 'a', 'b', 'c' ] not to match any /[a-c]/ (false negative fail)");

    err(function() {
      [8, 9].should.matchAny(10);
    }, "expected Array [ 8, 9 ] to match any 10");
  });
});
