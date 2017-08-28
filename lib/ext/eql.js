/*
 * should.js - assertion library
 * Copyright(c) 2010-2013 TJ Holowaychuk <tj@vision-media.ca>
 * Copyright(c) 2013-2017 Denis Bardadym <bardadymchik@gmail.com>
 * MIT Licensed
 */

import eql from "should-equal";
import getType from "should-type";
import { formatProp, format } from "../format";
import { forEach } from "should-type-adaptors";

function formatEqlResult(r, a, b) {
  return ((r.path.length > 0
    ? "at " + r.path.map(formatProp).join(" -> ")
    : "") +
    (r.a === a ? "" : ", A has " + format(r.a)) +
    (r.b === b ? "" : " and B has " + format(r.b)) +
    (r.showReason ? " because " + r.reason : "")).trim();
}

export default function(should, Assertion) {
  /**
   * Deep object equality comparison. For full spec see [`should-equal tests`](https://github.com/shouldjs/equal/blob/master/test.js).
   *
   * @name eql
   * @memberOf Assertion
   * @category assertion equality
   * @alias Assertion#eqls
   * @alias Assertion#deepEqual
   * @param {*} val Expected value
   * @param {string} [description] Optional message
   * @example
   *
   * (10).should.be.eql(10);
   * ('10').should.not.be.eql(10);
   * (-0).should.not.be.eql(+0);
   *
   * NaN.should.be.eql(NaN);
   *
   * ({ a: 10}).should.be.eql({ a: 10 });
   * [ 'a' ].should.not.be.eql({ '0': 'a' });
   */
  Assertion.add("eql", function(val, description) {
    this.params = { operator: "to equal", expected: val, message: description };
    var obj = this.obj;
    var fails = eql(this.obj, val, should.config);
    this.params.details = fails
      .map(function(fail) {
        return formatEqlResult(fail, obj, val);
      })
      .join(", ");

    this.params.showDiff = eql(getType(obj), getType(val)).length === 0;

    this.assert(fails.length === 0);
  });

  /**
   * Exact comparison using ===.
   *
   * @name equal
   * @memberOf Assertion
   * @category assertion equality
   * @alias Assertion#equals
   * @alias Assertion#exactly
   * @param {*} val Expected value
   * @param {string} [description] Optional message
   * @example
   *
   * 10.should.be.equal(10);
   * 'a'.should.be.exactly('a');
   *
   * should(null).be.exactly(null);
   */
  Assertion.add("equal", function(val, description) {
    this.params = { operator: "to be", expected: val, message: description };

    this.params.showDiff = eql(getType(this.obj), getType(val)).length === 0;

    this.assert(val === this.obj);
  });

  Assertion.alias("equal", "equals");
  Assertion.alias("equal", "exactly");
  Assertion.alias("eql", "eqls");
  Assertion.alias("eql", "deepEqual");

  function addOneOf(name, message, method) {
    Assertion.add(name, function(vals) {
      if (arguments.length !== 1) {
        vals = Array.prototype.slice.call(arguments);
      } else {
        should(vals).be.Array();
      }

      this.params = { operator: message, expected: vals };

      var obj = this.obj;
      var found = false;

      forEach(vals, function(val) {
        try {
          should(val)[method](obj);
          found = true;
          return false;
        } catch (e) {
          if (e instanceof should.AssertionError) {
            return; //do nothing
          }
          throw e;
        }
      });

      this.assert(found);
    });
  }

  /**
   * Exact comparison using === to be one of supplied objects.
   *
   * @name equalOneOf
   * @memberOf Assertion
   * @category assertion equality
   * @param {Array|*} vals Expected values
   * @example
   *
   * 'ab'.should.be.equalOneOf('a', 10, 'ab');
   * 'ab'.should.be.equalOneOf(['a', 10, 'ab']);
   */
  addOneOf("equalOneOf", "to be equals one of", "equal");

  /**
   * Exact comparison using .eql to be one of supplied objects.
   *
   * @name oneOf
   * @memberOf Assertion
   * @category assertion equality
   * @param {Array|*} vals Expected values
   * @example
   *
   * ({a: 10}).should.be.oneOf('a', 10, 'ab', {a: 10});
   * ({a: 10}).should.be.oneOf(['a', 10, 'ab', {a: 10}]);
   */
  addOneOf("oneOf", "to be one of", "eql");
}
