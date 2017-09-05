/*
 * should.js - assertion library
 * Copyright(c) 2010-2013 TJ Holowaychuk <tj@vision-media.ca>
 * Copyright(c) 2013-2017 Denis Bardadym <bardadymchik@gmail.com>
 * MIT Licensed
 */

import { formatProp } from "../format";
import { some, forEach } from "should-type-adaptors";
import eql from "should-equal";
import { isPlainObject } from "../util";

export default function(should, Assertion) {
  var i = should.format;

  /**
   * Asserts if given object match `other` object, using some assumptions:
   * First object matched if they are equal,
   * If `other` is a regexp and given object is a string check on matching with regexp
   * If `other` is a regexp and given object is an array check if all elements matched regexp
   * If `other` is a regexp and given object is an object check values on matching regexp
   * If `other` is a function check if this function throws AssertionError on given object or return false - it will be assumed as not matched
   * If `other` is an object check if the same keys matched with above rules
   * All other cases failed.
   *
   * Usually it is right idea to add pre type assertions, like `.String()` or `.Object()` to be sure assertions will do what you are expecting.
   * Object iteration happen by keys (properties with enumerable: true), thus some objects can cause small pain. Typical example is js
   * Error - it by default has 2 properties `name` and `message`, but they both non-enumerable. In this case make sure you specify checking props (see examples).
   *
   * @name match
   * @memberOf Assertion
   * @category assertion matching
   * @param {*} other Object to match
   * @param {string} [description] Optional message
   * @example
   * 'foobar'.should.match(/^foo/);
   * 'foobar'.should.not.match(/^bar/);
   *
   * ({ a: 'foo', c: 'barfoo' }).should.match(/foo$/);
   *
   * ['a', 'b', 'c'].should.match(/[a-z]/);
   *
   * (5).should.not.match(function(n) {
   *   return n < 0;
   * });
   * (5).should.not.match(function(it) {
   *    it.should.be.an.Array();
   * });
   * ({ a: 10, b: 'abc', c: { d: 10 }, d: 0 }).should
   * .match({ a: 10, b: /c$/, c: function(it) {
   *    return it.should.have.property('d', 10);
   * }});
   *
   * [10, 'abc', { d: 10 }, 0].should
   * .match({ '0': 10, '1': /c$/, '2': function(it) {
   *    return it.should.have.property('d', 10);
   * }});
   *
   * var myString = 'abc';
   *
   * myString.should.be.a.String().and.match(/abc/);
   *
   * myString = {};
   *
   * myString.should.match(/abc/); //yes this will pass
   * //better to do
   * myString.should.be.an.Object().and.not.empty().and.match(/abc/);//fixed
   *
   * (new Error('boom')).should.match(/abc/);//passed because no keys
   * (new Error('boom')).should.not.match({ message: /abc/ });//check specified property
   */
  Assertion.add("match", function(other, description) {
    this.params = { operator: "to match " + i(other), message: description };

    if (eql(this.obj, other).length !== 0) {
      if (other instanceof RegExp) {
        // something - regex

        if (typeof this.obj == "string") {
          this.assert(other.exec(this.obj));
        } else if (null != this.obj && typeof this.obj == "object") {
          var notMatchedProps = [],
            matchedProps = [];
          forEach(
            this.obj,
            function(value, name) {
              if (other.exec(value)) {
                matchedProps.push(formatProp(name));
              } else {
                notMatchedProps.push(formatProp(name) + " (" + i(value) + ")");
              }
            },
            this
          );

          if (notMatchedProps.length) {
            this.params.operator += "\n    not matched properties: " + notMatchedProps.join(", ");
          }
          if (matchedProps.length) {
            this.params.operator += "\n    matched properties: " + matchedProps.join(", ");
          }

          this.assert(notMatchedProps.length === 0);
        } else {
          // should we try to convert to String and exec?
          this.assert(false);
        }
      } else if (typeof other == "function") {
        var res;

        res = other(this.obj);

        //if we throw exception ok - it is used .should inside
        if (typeof res == "boolean") {
          this.assert(res); // if it is just boolean function assert on it
        }
      } else if (typeof this.obj == "object" && this.obj != null && (isPlainObject(other) || Array.isArray(other))) {
        // try to match properties (for Object and Array)
        notMatchedProps = [];
        matchedProps = [];

        forEach(
          other,
          function(value, key) {
            try {
              should(this.obj)
                .have.property(key)
                .which.match(value);
              matchedProps.push(formatProp(key));
            } catch (e) {
              if (e instanceof should.AssertionError) {
                notMatchedProps.push(formatProp(key) + " (" + i(this.obj[key]) + ")");
              } else {
                throw e;
              }
            }
          },
          this
        );

        if (notMatchedProps.length) {
          this.params.operator += "\n    not matched properties: " + notMatchedProps.join(", ");
        }
        if (matchedProps.length) {
          this.params.operator += "\n    matched properties: " + matchedProps.join(", ");
        }

        this.assert(notMatchedProps.length === 0);
      } else {
        this.assert(false);
      }
    }
  });

  /**
   * Asserts if given object values or array elements all match `other` object, using some assumptions:
   * First object matched if they are equal,
   * If `other` is a regexp - matching with regexp
   * If `other` is a function check if this function throws AssertionError on given object or return false - it will be assumed as not matched
   * All other cases check if this `other` equal to each element
   *
   * @name matchEach
   * @memberOf Assertion
   * @category assertion matching
   * @alias Assertion#matchEvery
   * @param {*} other Object to match
   * @param {string} [description] Optional message
   * @example
   * [ 'a', 'b', 'c'].should.matchEach(/\w+/);
   * [ 'a', 'a', 'a'].should.matchEach('a');
   *
   * [ 'a', 'a', 'a'].should.matchEach(function(value) { value.should.be.eql('a') });
   *
   * { a: 'a', b: 'a', c: 'a' }.should.matchEach(function(value) { value.should.be.eql('a') });
   */
  Assertion.add("matchEach", function(other, description) {
    this.params = {
      operator: "to match each " + i(other),
      message: description
    };

    forEach(
      this.obj,
      function(value) {
        should(value).match(other);
      },
      this
    );
  });

  /**
  * Asserts if any of given object values or array elements match `other` object, using some assumptions:
  * First object matched if they are equal,
  * If `other` is a regexp - matching with regexp
  * If `other` is a function check if this function throws AssertionError on given object or return false - it will be assumed as not matched
  * All other cases check if this `other` equal to each element
  *
  * @name matchAny
  * @memberOf Assertion
  * @category assertion matching
  * @param {*} other Object to match
  * @alias Assertion#matchSome
  * @param {string} [description] Optional message
  * @example
  * [ 'a', 'b', 'c'].should.matchAny(/\w+/);
  * [ 'a', 'b', 'c'].should.matchAny('a');
  *
  * [ 'a', 'b', 'c'].should.matchAny(function(value) { value.should.be.eql('a') });
  *
  * { a: 'a', b: 'b', c: 'c' }.should.matchAny(function(value) { value.should.be.eql('a') });
  */
  Assertion.add("matchAny", function(other, description) {
    this.params = {
      operator: "to match any " + i(other),
      message: description
    };

    this.assert(
      some(this.obj, function(value) {
        try {
          should(value).match(other);
          return true;
        } catch (e) {
          if (e instanceof should.AssertionError) {
            // Caught an AssertionError, return false to the iterator
            return false;
          }
          throw e;
        }
      })
    );
  });

  Assertion.alias("matchAny", "matchSome");
  Assertion.alias("matchEach", "matchEvery");
}
