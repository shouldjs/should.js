module.exports = function(should, Assertion) {
  /**
   * Simple chaining. It actually do nothing.
   *
   * @memberOf Assertion
   * @name be
   * @alias Assertion#an
   * @alias Assertion#of
   * @alias Assertion#a
   * @alias Assertion#and
   * @alias Assertion#have
   * @alias Assertion#with
   * @alias Assertion#is
   * @alias Assertion#which
   * @alias Assertion#the
   * @category assertion chaining
   */
  ['an', 'of', 'a', 'and', 'be', 'has', 'have', 'with', 'is', 'which', 'the', 'it'].forEach(function(name) {
    Assertion.addChain(name);
  });
};
