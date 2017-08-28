/*
 * should.js - assertion library
 * Copyright(c) 2010-2013 TJ Holowaychuk <tj@vision-media.ca>
 * Copyright(c) 2013-2017 Denis Bardadym <bardadymchik@gmail.com>
 * MIT Licensed
 */

export default function(should, Assertion) {
  /**
   * Simple chaining to improve readability. Does nothing.
   *
   * @memberOf Assertion
   * @name be
   * @property {should.Assertion} be
   * @alias Assertion#an
   * @alias Assertion#of
   * @alias Assertion#a
   * @alias Assertion#and
   * @alias Assertion#been
   * @alias Assertion#have
   * @alias Assertion#has
   * @alias Assertion#with
   * @alias Assertion#is
   * @alias Assertion#which
   * @alias Assertion#the
   * @alias Assertion#it
   * @category assertion chaining
   */
  [
    "an",
    "of",
    "a",
    "and",
    "be",
    "been",
    "has",
    "have",
    "with",
    "is",
    "which",
    "the",
    "it"
  ].forEach(function(name) {
    Assertion.addChain(name);
  });
}
