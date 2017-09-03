var util = require("./util");

should.Assertion.add(
  "_10",
  function() {
    this.params = { operator: "to be a number 10" };

    this.is.Number().and.equal(10);
  },
  true
);

it("should throw when used last managed context", function() {
  util.err(function() {
    (11).should.be._10();
  }, "expected 11 to be a number 10\n    expected 11 to be 10");

  util.err(
    function() {
      ({}.should.be._10());
    },
    "expected Object {} to be a number 10",
    "    expected Object {} to be a number",
    "        expected Object {} to have type number",
    "            expected 'object' to be 'number'"
  );

  util.err(function() {
    (10).should.not.be._10();
  }, "expected 10 not to be a number 10 (false negative fail)");
});
