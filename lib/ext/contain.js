/*
 * should.js - assertion library
 * Copyright(c) 2010-2013 TJ Holowaychuk <tj@vision-media.ca>
 * Copyright(c) 2013-2017 Denis Bardadym <bardadymchik@gmail.com>
 * MIT Licensed
 */

import { isIterable, some, isEmpty, forEach, iterator } from "should-type-adaptors";

import eql from "should-equal";

export default function(should, Assertion) {
  var i = should.format;

  /**
   * Assert that given object contain something that equal to `other`. It uses `should-equal` for equality checks.
   * If given object is array it search that one of elements was equal to `other`.
   * If given object is string it checks if `other` is a substring - expected that `other` is a string.
   * If given object is Object it checks that `other` is a subobject - expected that `other` is a object.
   *
   * @name containEql
   * @memberOf Assertion
   * @category assertion contain
   * @param {*} other Nested object
   * @example
   *
   * [1, 2, 3].should.containEql(1);
   * [{ a: 1 }, 'a', 10].should.containEql({ a: 1 });
   *
   * 'abc'.should.containEql('b');
   * 'ab1c'.should.containEql(1);
   *
   * ({ a: 10, c: { d: 10 }}).should.containEql({ a: 10 });
   * ({ a: 10, c: { d: 10 }}).should.containEql({ c: { d: 10 }});
   * ({ a: 10, c: { d: 10 }}).should.containEql({ b: 10 });
   * // throws AssertionError: expected { a: 10, c: { d: 10 } } to contain { b: 10 }
   * //            expected { a: 10, c: { d: 10 } } to have property b
   */
  Assertion.add("containEql", function(other) {
    this.params = { operator: "to contain " + i(other) };

    this.is.not.null().and.not.undefined();

    var obj = this.obj;

    if (typeof obj == "string") {
      this.assert(obj.indexOf(String(other)) >= 0);
    } else if (isIterable(obj)) {
      this.assert(
        some(obj, function(v) {
          return eql(v, other).length === 0;
        })
      );
    } else {
      forEach(
        other,
        function(value, key) {
          should(obj).have.value(key, value);
        },
        this
      );
    }
  });

  /**
   * Assert that given object is contain equally structured object on the same depth level.
   * If given object is an array and `other` is an array it checks that the eql elements is going in the same sequence in given array (recursive)
   * If given object is an object it checks that the same keys contain deep equal values (recursive)
   * On other cases it try to check with `.eql`
   *
   * @name containDeepOrdered
   * @memberOf Assertion
   * @category assertion contain
   * @param {*} other Nested object
   * @example
   *
   * [ 1, 2, 3].should.containDeepOrdered([1, 2]);
   * [ 1, 2, [ 1, 2, 3 ]].should.containDeepOrdered([ 1, [ 2, 3 ]]);
   *
   * ({ a: 10, b: { c: 10, d: [1, 2, 3] }}).should.containDeepOrdered({a: 10});
   * ({ a: 10, b: { c: 10, d: [1, 2, 3] }}).should.containDeepOrdered({b: {c: 10}});
   * ({ a: 10, b: { c: 10, d: [1, 2, 3] }}).should.containDeepOrdered({b: {d: [1, 3]}});
   */
  Assertion.add("containDeepOrdered", function(other) {
    this.params = { operator: "to contain " + i(other) };

    var obj = this.obj;
    if (typeof obj == "string") {
      // expect other to be string
      this.is.equal(String(other));
    } else if (isIterable(obj) && isIterable(other)) {
      var objIterator = iterator(obj);
      var otherIterator = iterator(other);

      var nextObj = objIterator.next();
      var nextOther = otherIterator.next();
      while (!nextObj.done && !nextOther.done) {
        try {
          should(nextObj.value[1]).containDeepOrdered(nextOther.value[1]);
          nextOther = otherIterator.next();
        } catch (e) {
          if (!(e instanceof should.AssertionError)) {
            throw e;
          }
        }
        nextObj = objIterator.next();
      }

      this.assert(nextOther.done);
    } else if (obj != null && typeof obj == "object" && other != null && typeof other == "object") {
      //TODO compare types object contains object case
      forEach(other, function(value, key) {
        should(obj[key]).containDeepOrdered(value);
      });

      // if both objects is empty means we finish traversing - and we need to compare for hidden values
      if (isEmpty(other)) {
        this.eql(other);
      }
    } else {
      this.eql(other);
    }
  });

  /**
   * The same like `Assertion#containDeepOrdered` but all checks on arrays without order.
   *
   * @name containDeep
   * @memberOf Assertion
   * @category assertion contain
   * @param {*} other Nested object
   * @example
   *
   * [ 1, 2, 3].should.containDeep([2, 1]);
   * [ 1, 2, [ 1, 2, 3 ]].should.containDeep([ 1, [ 3, 1 ]]);
   */
  Assertion.add("containDeep", function(other) {
    this.params = { operator: "to contain " + i(other) };

    var obj = this.obj;
    if (typeof obj === "string" && typeof other === "string") {
      // expect other to be string
      this.is.equal(String(other));
    } else if (isIterable(obj) && isIterable(other)) {
      var usedKeys = {};
      forEach(
        other,
        function(otherItem) {
          this.assert(
            some(obj, function(item, index) {
              if (index in usedKeys) {
                return false;
              }

              try {
                should(item).containDeep(otherItem);
                usedKeys[index] = true;
                return true;
              } catch (e) {
                if (e instanceof should.AssertionError) {
                  return false;
                }
                throw e;
              }
            })
          );
        },
        this
      );
    } else if (obj != null && other != null && typeof obj == "object" && typeof other == "object") {
      // object contains object case
      forEach(other, function(value, key) {
        should(obj[key]).containDeep(value);
      });

      // if both objects is empty means we finish traversing - and we need to compare for hidden values
      if (isEmpty(other)) {
        this.eql(other);
      }
    } else {
      this.eql(other);
    }
  });
}
