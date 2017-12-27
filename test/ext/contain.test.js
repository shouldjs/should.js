var err = require("../util").err;

describe("contain*", function() {
  it("test containEql", function() {
    "hello boy".should.containEql("boy");
    [1, 2, 3].should.containEql(3);
    [[1], [2], [3]].should.containEql([3]);
    [[1], [2], [3, 4]].should.not.containEql([3]);
    [{ a: "a" }, { b: "b", c: "c" }].should.containEql({ a: "a" });
    [{ a: "a" }, { b: "b", c: "c" }].should.not.containEql({ b: "b" });

    ({}.should.not.containEql({ a: 10 }));

    ({ b: 10 }.should.containEql({ b: 10 }));
    [1, 2, 3].should.containEql(1);
    [1, 2, { a: 10 }].should.containEql({ a: 10 });
    [1, 2, 3].should.not.containEql({ a: 1 });

    new Set([1, 2, 3]).should.containEql(1);

    err(function() {
      [1, 2, 3].should.not.containEql(3);
    }, "expected Array [ 1, 2, 3 ] not to contain 3 (false negative fail)");

    err(function() {
      [1, 2, 3].should.containEql(4);
    }, "expected Array [ 1, 2, 3 ] to contain 4");
  });

  it("test containDeep", function() {
    ({
      a: { b: 10 },
      b: { c: 10, d: 11, a: { b: 10, c: 11 } }
    }.should.containDeep({ a: { b: 10 }, b: { c: 10, a: { c: 11 } } }));

    [1, 2, 3, { a: { b: { d: 12 } } }].should.containDeep([
      { a: { b: { d: 12 } } }
    ]);

    [[1, [2, 3], 3], [2]].should.not.containDeep([1, 2]);

    [[1], [2], [3]].should.containDeep([[3]]);
    [[1], [2], [3, 4]].should.containDeep([[3]]);
    [[1], [2], [3, 4]].should.containDeep([[1], [3]]);
    [[1], [2], [3, 4]].should.containDeep([[3], [1]]);

    [1, 2, 3].should.not.containDeep([3, 3, 3]);
    [1, 2, 3].should.containDeep([3]);

    [{ a: "a" }, { b: "b", c: "c" }].should.containDeep([{ a: "a" }]);

    [{ a: "a" }, { b: "b", c: "c" }].should.containDeep([{ b: "b" }]);

    [1, 2, 3].should.containDeep([3, 2]);

    ["code-for-days", "code"].should.containDeep(["code", "code-for-days"]);
    ({ a: "hello" }.should.not.containDeep({ a: ["hello"] }));
    ["code-for-days", "code-fast"].should.containDeep([
      "code-fast",
      "code-for-days"
    ]);

    err(function() {
      [{ a: "a" }, { b: "b", c: "c" }].should.not.containDeep([{ b: "b" }]);
    }, "expected Array [ Object { a: 'a' }, Object { b: 'b', c: 'c' } ] not to contain Array [ Object { b: 'b' } ] (false negative fail)");

    ({ hi: null }.should.containEql({ hi: null }));

    var firstDec = [{ date: new Date("2014-12-01 00:00:00") }];
    var secondDec = [{ date: new Date("2014-12-02 00:00:00") }];
    firstDec.should.not.containDeep(secondDec);

    [{ date: { d: new Date("2014-12-01 00:00:00") } }].should.not.containDeep([
      { date: new Date("2014-12-02 00:00:00") }
    ]);
  });

  it("test containDeepOrdered", function() {
    ({
      a: { b: 10 },
      b: { c: 10, d: 11, a: { b: 10, c: 11 } }
    }.should.containDeepOrdered({ a: { b: 10 }, b: { c: 10, a: { c: 11 } } }));

    [1, 2, 3, { a: { b: { d: 12 } } }].should.containDeepOrdered([
      { a: { b: { d: 12 } } }
    ]);

    [[1, [2, 3], 3], [2]].should.not.containDeepOrdered([1, 2]);

    [[1], [2], [3]].should.containDeepOrdered([[3]]);
    [[1], [2], [3, 4]].should.containDeepOrdered([[3]]);
    [[1], [2], [3, 4]].should.containDeepOrdered([[1], [3]]);
    [[1], [2], [3, 4]].should.not.containDeepOrdered([[3], [1]]);
    [{ a: "a" }, { b: "b", c: "c" }].should.containDeepOrdered([{ a: "a" }]);
    [{ a: "a" }, { b: "b", c: "c" }].should.containDeepOrdered([{ b: "b" }]);

    err(function() {
      [{ a: "a" }, { b: "b", c: "c" }].should.not.containDeepOrdered([
        { b: "b" }
      ]);
    }, "expected Array [ Object { a: 'a' }, Object { b: 'b', c: 'c' } ] not to contain Array [ Object { b: 'b' } ] (false negative fail)");

    ({ hi: null }.should.containEql({ hi: null }));
  });
});
