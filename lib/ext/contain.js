/*!
 * Should
 * Copyright(c) 2010-2014 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */

var util = require('../util'),
  _eql = require('../eql');

module.exports = function(should, Assertion) {
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
  Assertion.add('containEql', function(other) {
    var eql = _eql();
    this.params = { operator: 'to contain ' + i(other) };
    var obj = this.obj;
    if(util.isArray(obj)) {
      this.assert(obj.some(function(item) {
        return eql(item, other).result;
      }));
    } else if(util.isString(obj)) {
      // expect obj to be string
      this.assert(obj.indexOf(String(other)) >= 0);
    } else if(util.isObject(obj)) {
      // object contains object case
      util.forOwn(other, function(value, key) {
        obj.should.have.property(key, value);
      });
    } else {
      //other uncovered cases
      this.assert(false);
    }
  });

  /**
   * Assert that given object is contain equally structured object on the same depth level.
   * If given object is an array and `other` is an array it checks that the eql elements is going in the same sequence in given array (recursive)
   * For string it is working as `Assertion#containEql
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
   * '123'.should.containDeepOrdered('1')
   *
   * ({ a: 10, b: { c: 10, d: [1, 2, 3] }}).should.containDeepOrdered({a: 10});
   * ({ a: 10, b: { c: 10, d: [1, 2, 3] }}).should.containDeepOrdered({b: {c: 10}});
   * ({ a: 10, b: { c: 10, d: [1, 2, 3] }}).should.containDeepOrdered({b: {d: [1, 3]}});
   */
  Assertion.add('containDeepOrdered', function(other) {
    var eql = _eql();
    this.params = { operator: 'to contain ' + i(other) };

    var obj = this.obj;
    if(util.isArray(obj) && util.isArray(other)) {
      var otherIdx = 0;
      obj.forEach(function(item) {
        try {
          should(item).containDeepOrdered(other[otherIdx]);
          otherIdx++;
        } catch(e) {
          if(e instanceof should.AssertionError) {
            return;
          }
          throw e;
        }
      }, this);

      this.assert(otherIdx == other.length);
    } else if(util.isString(obj)) {// expect other to be string
      this.assert(obj.indexOf(String(other)) >= 0);
    } else if(util.isObject(obj) && util.isObject(other)) {// object contains object case
      util.forOwn(other, function(value, key) {
        should(obj[key]).containDeepOrdered(value);
      });

      // if both objects is empty means we finish traversing - and we need to compare for hidden values
      if(util.isEmptyObject(other)) {
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
  Assertion.add('containDeep', function(other) {
    var eql = _eql();
    this.params = { operator: 'to contain ' + i(other) };

    var obj = this.obj;
    if(util.isArray(obj) && util.isArray(other)) {
      var usedKeys = {};
      other.forEach(function(otherItem) {
        this.assert(obj.some(function(item, index) {
          if(index in usedKeys) return false;

          try {
            should(item).containDeep(otherItem);
            usedKeys[index] = true;
            return true;
          } catch(e) {
            if(e instanceof should.AssertionError) {
              return false;
            }
            throw e;
          }
        }));
      }, this);
    } else if(util.isString(obj)) {// expect other to be string
      this.assert(obj.indexOf(String(other)) >= 0);
    } else if(util.isObject(obj) && util.isObject(other)) {// object contains object case
      util.forOwn(other, function(value, key) {
        should(obj[key]).containDeep(value);
      });

      // if both objects is empty means we finish traversing - and we need to compare for hidden values
      if(util.isEmptyObject(other)) {
        this.eql(other);
      }
    } else {
      this.eql(other);
    }
  });

};
