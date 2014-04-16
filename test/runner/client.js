(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*!
 * Should
 * Copyright(c) 2010-2014 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */

// Taken from node's assert module, because it sucks
// and exposes next to nothing useful.
var util = require('./util');

module.exports = _deepEqual;

var pSlice = Array.prototype.slice;

function _deepEqual(actual, expected) {
  // 7.1. All identical values are equivalent, as determined by ===.
  if (actual === expected) {
    return true;

  } else if (util.isBuffer(actual) && util.isBuffer(expected)) {
    if (actual.length != expected.length) return false;

    for (var i = 0; i < actual.length; i++) {
      if (actual[i] !== expected[i]) return false;
    }

    return true;

  // 7.2. If the expected value is a Date object, the actual value is
  // equivalent if it is also a Date object that refers to the same time.
  } else if (util.isDate(actual) && util.isDate(expected)) {
    return actual.getTime() === expected.getTime();

  // 7.3 If the expected value is a RegExp object, the actual value is
  // equivalent if it is also a RegExp object with the same source and
  // properties (`global`, `multiline`, `lastIndex`, `ignoreCase`).
  } else if (util.isRegExp(actual) && util.isRegExp(expected)) {
    return actual.source === expected.source &&
           actual.global === expected.global &&
           actual.multiline === expected.multiline &&
           actual.lastIndex === expected.lastIndex &&
           actual.ignoreCase === expected.ignoreCase;

  // 7.4. Other pairs that do not both pass typeof value == 'object',
  // equivalence is determined by ==.
  } else if (!util.isObject(actual) && !util.isObject(expected)) {
    return actual == expected;

  // 7.5 For all other Object pairs, including Array objects, equivalence is
  // determined by having the same number of owned properties (as verified
  // with Object.prototype.hasOwnProperty.call), the same set of keys
  // (although not necessarily the same order), equivalent values for every
  // corresponding key, and an identical 'prototype' property. Note: this
  // accounts for both named and indexed properties on Arrays.
  } else {
    return objEquiv(actual, expected);
  }
}


function objEquiv (a, b) {
  if (util.isNullOrUndefined(a) || util.isNullOrUndefined(b))
    return false;
  // an identical 'prototype' property.
  if (a.prototype !== b.prototype) return false;
  //~~~I've managed to break Object.keys through screwy arguments passing.
  //   Converting to array solves the problem.
  if (util.isArguments(a)) {
    if (!util.isArguments(b)) {
      return false;
    }
    a = pSlice.call(a);
    b = pSlice.call(b);
    return _deepEqual(a, b);
  }
  try{
    var ka = Object.keys(a),
      kb = Object.keys(b),
      key, i;
  } catch (e) {//happens when one is a string literal and the other isn't
    return false;
  }
  // having the same number of owned properties (keys incorporates
  // hasOwnProperty)
  if (ka.length != kb.length)
    return false;
  //the same set of keys (although not necessarily the same order),
  ka.sort();
  kb.sort();
  //~~~cheap key test
  for (i = ka.length - 1; i >= 0; i--) {
    if (ka[i] != kb[i])
      return false;
  }
  //equivalent values for every corresponding key, and
  //~~~possibly expensive deep test
  for (i = ka.length - 1; i >= 0; i--) {
    key = ka[i];
    if (!_deepEqual(a[key], b[key])) return false;
  }
  return true;
}

},{"./util":16}],2:[function(require,module,exports){
/*!
 * Should
 * Copyright(c) 2010-2014 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */

var util = require('../util')
  , assert = require('assert')
  , AssertionError = assert.AssertionError;

module.exports = function(should) {
  var i = should.format;

  /**
   * Expose assert to should
   *
   * This allows you to do things like below
   * without require()ing the assert module.
   *
   *    should.equal(foo.bar, undefined);
   *
   */
  util.merge(should, assert);

  /**
   * Assert _obj_ exists, with optional message.
   *
   * @param {*} obj
   * @param {String} [msg]
   * @api public
   */
  should.exist = should.exists = function(obj, msg) {
    if(null == obj) {
      throw new AssertionError({
        message: msg || ('expected ' + i(obj) + ' to exist'), stackStartFunction: should.exist
      });
    }
  };

  /**
   * Asserts _obj_ does not exist, with optional message.
   *
   * @param {*} obj
   * @param {String} [msg]
   * @api public
   */

  should.not = {};
  should.not.exist = should.not.exists = function(obj, msg) {
    if(null != obj) {
      throw new AssertionError({
        message: msg || ('expected ' + i(obj) + ' to not exist'), stackStartFunction: should.not.exist
      });
    }
  };
};
},{"../util":16,"assert":17}],3:[function(require,module,exports){
/*!
 * Should
 * Copyright(c) 2010-2014 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */

module.exports = function(should, Assertion) {
  Assertion.add('true', function() {
    this.is.exactly(true);
  }, true);

  Assertion.add('false', function() {
    this.is.exactly(false);
  }, true);

  Assertion.add('ok', function() {
    this.params = { operator: 'to be truthy' };

    this.assert(this.obj);
  }, true);
};
},{}],4:[function(require,module,exports){
/*!
 * Should
 * Copyright(c) 2010-2014 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */

module.exports = function(should, Assertion) {

  function addLink(name) {
    Object.defineProperty(Assertion.prototype, name, {
      get: function() {
        return this;
      }
    });
  }

  ['an', 'of', 'a', 'and', 'be', 'have', 'with', 'is', 'which', 'the'].forEach(addLink);
};
},{}],5:[function(require,module,exports){
/*!
 * Should
 * Copyright(c) 2010-2014 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */

var util = require('../util'),
  eql = require('../eql');

module.exports = function(should, Assertion) {
  var i = should.format;

  Assertion.add('include', function(obj, description) {
    if(!Array.isArray(this.obj) && !util.isString(this.obj)) {
      this.params = { operator: 'to include an object equal to ' + i(obj), message: description };
      var cmp = {};
      for(var key in obj) cmp[key] = this.obj[key];
      this.assert(eql(cmp, obj));
    } else {
      this.params = { operator: 'to include ' + i(obj), message: description };

      this.assert(~this.obj.indexOf(obj));
    }
  });

  Assertion.add('includeEql', function(obj, description) {
    this.params = { operator: 'to include an object equal to ' + i(obj), message: description };

    this.assert(this.obj.some(function(item) {
      return eql(obj, item);
    }));
  });
};
},{"../eql":1,"../util":16}],6:[function(require,module,exports){
/*!
 * Should
 * Copyright(c) 2010-2014 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */

var eql = require('../eql');

module.exports = function(should, Assertion) {
  Assertion.add('eql', function(val, description) {
    this.params = { operator: 'to equal', expected: val, showDiff: true, message: description };

    this.assert(eql(val, this.obj));
  });

  Assertion.add('equal', function(val, description) {
    this.params = { operator: 'to be', expected: val, showDiff: true, message: description };

    this.assert(val === this.obj);
  });

  Assertion.alias('equal', 'exactly');
};
},{"../eql":1}],7:[function(require,module,exports){
/*!
 * Should
 * Copyright(c) 2010-2014 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */

module.exports = function(should, Assertion) {
  var i = should.format;

  Assertion.add('throw', function(message) {
    var fn = this.obj
      , err = {}
      , errorInfo = ''
      , ok = true;

    try {
      fn();
      ok = false;
    } catch(e) {
      err = e;
    }

    if(ok) {
      if('string' == typeof message) {
        ok = message == err.message;
      } else if(message instanceof RegExp) {
        ok = message.test(err.message);
      } else if('function' == typeof message) {
        ok = err instanceof message;
      }

      if(message && !ok) {
        if('string' == typeof message) {
          errorInfo = " with a message matching '" + message + "', but got '" + err.message + "'";
        } else if(message instanceof RegExp) {
          errorInfo = " with a message matching " + message + ", but got '" + err.message + "'";
        } else if('function' == typeof message) {
          errorInfo = " of type " + message.name + ", but got " + err.constructor.name;
        }
      } else {
        errorInfo = " (got " + i(err) + ")";
      }
    }

    this.params = { operator: 'to throw exception' + errorInfo };

    this.assert(ok);
  });

  Assertion.alias('throw', 'throwError');
};
},{}],8:[function(require,module,exports){
/*!
 * Should
 * Copyright(c) 2010-2014 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */
var util = require('../util');

//var statusCodes = require('http').STATUS_CODES;

module.exports = function(should, Assertion) {
  var i = should.format;

  Assertion.add('header', function(field, val) {
    this.have.property('headers');
    this.params = { obj: '{ ..., headers: ' + i(this.obj)  + ', ... }', operator: 'to have header ' + i(field) + (val !== undefined ? (':' + i(val)) : '') };
    if (val !== undefined) {
      this.have.property(field.toLowerCase(), val);
    } else {
      this.have.property(field.toLowerCase());
    }
  });

  Assertion.add('status', function(code) {
    //this.params = { operator: 'to have response code ' + code + ' ' + i(statusCodes[code])
    //    + ', but got ' + this.obj.statusCode + ' ' + i(statusCodes[this.obj.statusCode]) }

    this.have.property('statusCode', code);
  });

  Assertion.add('json', function() {
    this.have.property('headers')
      .and.have.property('content-type').include('application/json');
  }, true);

  Assertion.add('html', function() {
    this.have.property('headers')
      .and.have.property('content-type').include('text/html');
  }, true);
};
},{"../util":16}],9:[function(require,module,exports){
/*!
 * Should
 * Copyright(c) 2010-2014 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */

var util = require('../util'),
  eql = require('../eql');

module.exports = function(should, Assertion) {
  var i = should.format;

  Assertion.add('match', function(other, description) {
    this.params = { operator: 'to match ' + i(other), message: description };

    if(!eql(this.obj, other)) {
      if(util.isRegExp(other)) { // something - regex

        if(util.isString(this.obj)) {

          this.assert(other.exec(this.obj));
        } else if(Array.isArray(this.obj)) {

          this.obj.forEach(function(item) {
            this.assert(other.exec(item));// should we try to convert to String and exec?
          }, this);
        } else if(util.isObject(this.obj)) {

          var notMatchedProps = [], matchedProps = [];
          util.forOwn(this.obj, function(value, name) {
            if(other.exec(value)) matchedProps.push(i(name));
            else notMatchedProps.push(i(name));
          }, this);

          if(notMatchedProps.length)
            this.params.operator += '\n\tnot matched properties: ' + notMatchedProps.join(', ');
          if(matchedProps.length)
            this.params.operator += '\n\tmatched properties: ' + matchedProps.join(', ');

          this.assert(notMatchedProps.length == 0);
        } // should we try to convert to String and exec?
      } else if(util.isFunction(other)) {
        var res;
        try {
          res = other(this.obj);
        } catch(e) {
          if(e instanceof should.AssertionError) {
            this.params.operator += '\n\t' + e.message;
          }
          throw e;
        }

        if(res instanceof Assertion) {
          this.params.operator += '\n\t' + res.getMessage();
        }

        //if we throw exception ok - it is used .should inside
        if(util.isBoolean(res)) {
          this.assert(res); // if it is just boolean function assert on it
        }
      } else if(util.isObject(other)) { // try to match properties (for Object and Array)
        notMatchedProps = []; matchedProps = [];

        util.forOwn(other, function(value, key) {
          try {
            this.obj[key].should.match(value);
            matchedProps.push(key);
          } catch(e) {
            if(e instanceof should.AssertionError) {
              notMatchedProps.push(key);
            } else {
              throw e;
            }
          }
        }, this);

        if(notMatchedProps.length)
          this.params.operator += '\n\tnot matched properties: ' + notMatchedProps.join(', ');
        if(matchedProps.length)
          this.params.operator += '\n\tmatched properties: ' + matchedProps.join(', ');

        this.assert(notMatchedProps.length == 0);
      } else {
        this.assert(false);
      }
    }
  });

  Assertion.add('matchEach', function(other, description) {
    this.params = { operator: 'to match each ' + i(other), message: description };

    var f = other;

    if(util.isRegExp(other))
      f = function(it) {
        return !!other.exec(it);
      };
    else if(!util.isFunction(other))
      f = function(it) {
        return eql(it, other);
      };

    util.forOwn(this.obj, function(value, key) {
      var res = f(value, key);

      //if we throw exception ok - it is used .should inside
      if(util.isBoolean(res)) {
        this.assert(res); // if it is just boolean function assert on it
      }
    }, this);
  });
};
},{"../eql":1,"../util":16}],10:[function(require,module,exports){
/*!
 * Should
 * Copyright(c) 2010-2014 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */

module.exports = function(should, Assertion) {
  Assertion.add('NaN', function() {
    this.params = { operator: 'to be NaN' };

    this.assert(this.obj !== this.obj);
  }, true);

  Assertion.add('Infinity', function() {
    this.params = { operator: 'to be Infinity' };

    this.is.a.Number
      .and.not.a.NaN
      .and.assert(!isFinite(this.obj));
  }, true);

  Assertion.add('within', function(start, finish, description) {
    this.params = { operator: 'to be within ' + start + '..' + finish, message: description };

    this.assert(this.obj >= start && this.obj <= finish);
  });

  Assertion.add('approximately', function(value, delta, description) {
    this.params = { operator: 'to be approximately ' + value + " ±" + delta, message: description };

    this.assert(Math.abs(this.obj - value) <= delta);
  });

  Assertion.add('above', function(n, description) {
    this.params = { operator: 'to be above ' + n, message: description };

    this.assert(this.obj > n);
  });

  Assertion.add('below', function(n, description) {
    this.params = { operator: 'to be below ' + n, message: description };

    this.assert(this.obj < n);
  });

  Assertion.alias('above', 'greaterThan');
  Assertion.alias('below', 'lessThan');

};

},{}],11:[function(require,module,exports){
/*!
 * Should
 * Copyright(c) 2010-2014 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */

var util = require('../util'),
  eql = require('../eql');

var aSlice = Array.prototype.slice;

module.exports = function(should, Assertion) {
  var i = should.format;

  Assertion.add('enumerable', function(name, val) {
    this.params = {
      operator:"to have enumerable property '"+name+"'"
    };

    this.assert(this.obj.propertyIsEnumerable(name));

    if(arguments.length > 1){
      this.params.operator += " equal to '"+val+"'";
      this.assert(eql(val, this.obj[name]));
    }
  });

  Assertion.add('property', function(name, val) {
    if(arguments.length > 1) {
      var p = {};
      p[name] = val;
      this.have.properties(p);
    } else {
      this.have.properties(name);
    }
    this.obj = this.obj[name];
  });

  Assertion.add('properties', function(names) {
    var values = {};
    if(arguments.length > 1) {
      names = aSlice.call(arguments);
    } else if(!Array.isArray(names)) {
      if(util.isString(names)) {
        names = [names];
      } else {
        values = names;
        names = Object.keys(names);
      }
    }

    var obj = Object(this.obj), missingProperties = [];

    //just enumerate properties and check if they all present
    names.forEach(function(name) {
      if(!(name in obj)) missingProperties.push(i(name));
    });

    var props = missingProperties;
    if(props.length === 0) {
      props = names.map(i);
    } else if(this.one) {
      props = names.filter(function(name) {
        return missingProperties.indexOf(i(name)) < 0;
      }).map(i);
    }

    var operator = (props.length === 1 ?
      'to have property ' : 'to have '+(this.one? 'any of ' : '')+'properties ') + props.join(', ');

    this.params = { operator: operator };

    //check that all properties presented
    //or if we request one of them that at least one them presented
    this.assert(missingProperties.length === 0 || (this.one && missingProperties.length != names.length));

    // check if values in object matched expected
    var valueCheckNames = Object.keys(values);
    if(valueCheckNames.length) {
      var wrongValues = [];
      props = [];

      // now check values, as there we have all properties
      valueCheckNames.forEach(function(name) {
        var value = values[name];
        if(!eql(obj[name], value)) {
          wrongValues.push(i(name) + ' of ' + i(value) + ' (got ' + i(obj[name]) + ')');
        } else {
          props.push(i(name) + ' of ' + i(value));
        }
      });

      if((wrongValues.length !== 0 && !this.one) || (this.one && props.length === 0)) {
        props = wrongValues;
      }

      operator = (props.length === 1 ?
        'to have property ' : 'to have '+(this.one? 'any of ' : '')+'properties ') + props.join(', ');

      this.params = { operator: operator };

      //if there is no not matched values
      //or there is at least one matched
      this.assert(wrongValues.length === 0 || (this.one && wrongValues.length != valueCheckNames.length));
    }
  });

  Assertion.add('length', function(n, description) {
    this.have.property('length', n, description);
  });

  Assertion.alias('length', 'lengthOf');

  var hasOwnProperty = Object.prototype.hasOwnProperty;

  Assertion.add('ownProperty', function(name, description) {
    this.params = { operator: 'to have own property ' + i(name), message: description };

    this.assert(hasOwnProperty.call(this.obj, name));

    this.obj = this.obj[name];
  });

  Assertion.alias('hasOwnProperty', 'ownProperty');

  Assertion.add('empty', function() {
    this.params = { operator: 'to be empty' };

    if(util.isString(this.obj) || Array.isArray(this.obj) || util.isArguments(this.obj)) {
      this.have.property('length', 0);
    } else {
      var obj = Object(this.obj); // wrap to reference for booleans and numbers
      for(var prop in obj) {
        this.have.not.ownProperty(prop);
      }
    }
  }, true);

  Assertion.add('keys', function(keys) {
    if(arguments.length > 1) keys = aSlice.call(arguments);
    else if(arguments.length === 1 && util.isString(keys)) keys = [ keys ];
    else if(arguments.length === 0) keys = [];

    var obj = Object(this.obj);

    // first check if some keys are missing
    var missingKeys = [];
    keys.forEach(function(key) {
      if(!hasOwnProperty.call(this.obj, key))
        missingKeys.push(i(key));
    }, this);

    // second check for extra keys
    var extraKeys = [];
    Object.keys(obj).forEach(function(key) {
      if(keys.indexOf(key) < 0) {
        extraKeys.push(i(key));
      }
    });

    var verb = keys.length === 0 ? 'to be empty' :
      'to have ' + (keys.length === 1 ? 'key ' : 'keys ');

    this.params = { operator: verb + keys.map(i).join(', ')};

    if(missingKeys.length > 0)
      this.params.operator += '\n\tmissing keys: ' + missingKeys.join(', ');

    if(extraKeys.length > 0)
      this.params.operator += '\n\textra keys: ' + extraKeys.join(', ');

    this.assert(missingKeys.length === 0 && extraKeys.length === 0);
  });

  Assertion.alias("keys", "key");

  Assertion.add('containEql', function(other) {
    this.params = { operator: 'to contain ' + i(other) };
    var obj = this.obj;
    if(Array.isArray(obj)) {
      this.assert(obj.some(function(item) {
        return eql(item, other);
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

  Assertion.add('containDeep', function(other) {
    this.params = { operator: 'to contain ' + i(other) };

    var obj = this.obj;
    if(Array.isArray(obj)) {
      if(Array.isArray(other)) {
        var otherIdx = 0;
        obj.forEach(function(item) {
          try {
            should(item).not.be.null.and.containDeep(other[otherIdx]);
            otherIdx++;
          } catch(e) {
            if(e instanceof should.AssertionError) {
              return;
            }
            throw e;
          }
        });
        this.assert(otherIdx == other.length);
        //search array contain other as sub sequence
      } else {
        this.assert(false);
      }
    } else if(util.isString(obj)) {// expect other to be string
      this.assert(obj.indexOf(String(other)) >= 0);
    } else if(util.isObject(obj)) {// object contains object case
      if(util.isObject(other)) {
        util.forOwn(other, function(value, key) {
          should(obj[key]).not.be.null.and.containDeep(value);
        });
      } else {//one of the properties contain value
        this.assert(false);
      }
    } else {
      this.eql(other);
    }
  });

};

},{"../eql":1,"../util":16}],12:[function(require,module,exports){
/*!
 * Should
 * Copyright(c) 2010-2014 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */

module.exports = function(should, Assertion) {
  Assertion.add('startWith', function(str, description) {
    this.params = { operator: 'to start with ' + should.format(str), message: description };

    this.assert(0 === this.obj.indexOf(str));
  });

  Assertion.add('endWith', function(str, description) {
    this.params = { operator: 'to end with ' + should.format(str), message: description };

    this.assert(this.obj.indexOf(str, this.obj.length - str.length) >= 0);
  });
};
},{}],13:[function(require,module,exports){
/*!
 * Should
 * Copyright(c) 2010-2014 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */

var util = require('../util');

module.exports = function(should, Assertion) {
  Assertion.add('Number', function() {
    this.params = { operator: 'to be a number' };

    this.assert(util.isNumber(this.obj));
  }, true);

  Assertion.add('arguments', function() {
    this.params = { operator: 'to be arguments' };

    this.assert(util.isArguments(this.obj));
  }, true);

  Assertion.add('type', function(type, description) {
    this.params = { operator: 'to have type ' + type, message: description };

    (typeof this.obj).should.be.exactly(type, description);
  });

  Assertion.add('instanceof', function(constructor, description) {
    this.params = { operator: 'to be an instance of ' + constructor.name, message: description };

    this.assert(Object(this.obj) instanceof constructor);
  });

  Assertion.add('Function', function() {
    this.params = { operator: 'to be a function' };

    this.assert(util.isFunction(this.obj));
  }, true);

  Assertion.add('Object', function() {
    this.params = { operator: 'to be an object' };

    this.assert(util.isObject(this.obj));
  }, true);

  Assertion.add('String', function() {
    this.params = { operator: 'to be a string' };

    this.assert(util.isString(this.obj));
  }, true);

  Assertion.add('Array', function() {
    this.params = { operator: 'to be an array' };

    this.assert(Array.isArray(this.obj));
  }, true);

  Assertion.add('Boolean', function() {
    this.params = { operator: 'to be a boolean' };

    this.assert(util.isBoolean(this.obj));
  }, true);

  Assertion.add('Error', function() {
    this.params = { operator: 'to be an error' };

    this.assert(util.isError(this.obj));
  }, true);

  Assertion.add('null', function() {
    this.params = { operator: 'to be null' };

    this.assert(this.obj === null);
  }, true);

  Assertion.alias('instanceof', 'instanceOf');
};
},{"../util":16}],14:[function(require,module,exports){
/*!
 * Should
 * Copyright(c) 2010-2014 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */

var should = require('./should');

should
  .use(require('./ext/assert'))
  .use(require('./ext/chain'))
  .use(require('./ext/bool'))
  .use(require('./ext/number'))
  .use(require('./ext/eql'))
  .use(require('./ext/type'))
  .use(require('./ext/string'))
  .use(require('./ext/property'))
  .use(require('./ext/http'))
  .use(require('./ext/error'))
  .use(require('./ext/match'))
  .use(require('./ext/deprecated'));

 module.exports = should;
},{"./ext/assert":2,"./ext/bool":3,"./ext/chain":4,"./ext/deprecated":5,"./ext/eql":6,"./ext/error":7,"./ext/http":8,"./ext/match":9,"./ext/number":10,"./ext/property":11,"./ext/string":12,"./ext/type":13,"./should":15}],15:[function(require,module,exports){
/*!
 * Should
 * Copyright(c) 2010-2014 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */


var util = require('./util')
  , AssertionError = util.AssertionError
  , inspect = util.inspect;

/**
 * Our function should
 * @param obj
 * @returns {Assertion}
 */
var should = function(obj) {
  return new Assertion(util.isWrapperType(obj) ? obj.valueOf(): obj);
};

/**
 * Initialize a new `Assertion` with the given _obj_.
 *
 * @param {*} obj
 * @api private
 */

var Assertion = should.Assertion = function Assertion(obj) {
  this.obj = obj;
};


/**
  Way to extend Assertion function. It uses some logic 
  to define only positive assertions and itself rule with negative assertion.

  All actions happen in subcontext and this method take care about negation.
  Potentially we can add some more modifiers that does not depends from state of assertion.
*/
Assertion.add = function(name, f, isGetter) {
  var prop = {};
  prop[isGetter ? 'get' : 'value'] = function() {
    var context = new Assertion(this.obj);
    context.copy = context.copyIfMissing;
    context.one = this.one;

    try {
      f.apply(context, arguments);
    } catch(e) {
      //copy data from sub context to this
      this.copy(context);

      //check for fail
      if(e instanceof should.AssertionError) {
        //negative fail
        if(this.negate) {
          this.obj = context.obj;
          this.negate = false;
          return this;
        }
        this.assert(false);
      }
      // throw if it is another exception
      throw e;
    }
    //copy data from sub context to this
    this.copy(context);
    if(this.negate) {
      this.assert(false);
    }

    this.obj = context.obj;
    this.negate = false;
    return this;
  };

  Object.defineProperty(Assertion.prototype, name, prop);
};

Assertion.alias = function(from, to) {
  Assertion.prototype[to] = Assertion.prototype[from];
};

should.AssertionError = AssertionError;
var i = should.format = function i(value) {
  if(util.isDate(value) && typeof value.inspect !== 'function') return value.toISOString(); //show millis in dates
  return inspect(value, { depth: null });
};

should.use = function(f) {
  f(this, Assertion);
  return this;
};


/**
 * Expose should to external world.
 */
exports = module.exports = should;


/**
 * Expose api via `Object#should`.
 *
 * @api public
 */

Object.defineProperty(Object.prototype, 'should', {
  set: function(){},
  get: function(){
    return should(this);
  },
  configurable: true
});


Assertion.prototype = {
  constructor: Assertion,

  assert: function(expr) {
    if(expr) return;

    var params = this.params;

    var msg = params.message, generatedMessage = false;
    if(!msg) {
      msg = this.getMessage();
      generatedMessage = true;
    }

    var err = new AssertionError({
      message: msg
      , actual: this.obj
      , expected: params.expected
      , stackStartFunction: this.assert
    });

    err.showDiff = params.showDiff;
    err.operator = params.operator;
    err.generatedMessage = generatedMessage;

    throw err;
  },

  getMessage: function() {
    return 'expected ' + ('obj' in this.params ? this.params.obj: i(this.obj)) + (this.negate ? ' not ': ' ') +
        this.params.operator + ('expected' in this.params  ? ' ' + i(this.params.expected) : '');
  },

  copy: function(other) {
    this.params = other.params;
  },

  copyIfMissing: function(other) {
    if(!this.params) this.params = other.params;
  },


  /**
   * Negation modifier.
   *
   * @api public
   */

  get not() {
    this.negate = !this.negate;
    return this;
  },

  /**
   * Any modifier - it affect on execution of sequenced assertion to do not check all, but any of
   *
   * @api public
   */
  get any() {
    this.one = true;
    return this;
  }
};


},{"./util":16}],16:[function(require,module,exports){
/*!
 * Should
 * Copyright(c) 2010-2014 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */

/**
 * Check if given obj just a primitive type wrapper
 * @param {Object} obj
 * @returns {boolean}
 * @api private
 */
exports.isWrapperType = function(obj) {
    return isNumber(obj) || isString(obj) || isBoolean(obj);
};

/**
 * Merge object b with object a.
 *
 *     var a = { foo: 'bar' }
 *       , b = { bar: 'baz' };
 *
 *     utils.merge(a, b);
 *     // => { foo: 'bar', bar: 'baz' }
 *
 * @param {Object} a
 * @param {Object} b
 * @return {Object}
 * @api private
 */

exports.merge = function(a, b){
  if (a && b) {
    for (var key in b) {
      a[key] = b[key];
    }
  }
  return a;
};

function isNumber(arg) {
  return typeof arg === 'number' || arg instanceof Number;
}

exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string' || arg instanceof String;
}

function isBoolean(arg) {
  return typeof arg === 'boolean' || arg instanceof Boolean;
}
exports.isBoolean = isBoolean;

exports.isString = isString;

function isBuffer(arg) {
  return typeof Buffer !== 'undefined' && arg instanceof Buffer;
}

exports.isBuffer = isBuffer;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}

exports.isDate = isDate;

function objectToString(o) {
  return Object.prototype.toString.call(o);
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

exports.isObject = isObject;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}

exports.isRegExp = isRegExp;

function isNullOrUndefined(arg) {
  return arg == null;
}

exports.isNullOrUndefined = isNullOrUndefined;

function isArguments(object) {
  return objectToString(object) === '[object Arguments]';
}

exports.isArguments = isArguments;

exports.isFunction = function(arg) {
  return typeof arg === 'function' || arg instanceof Function;
};

function isError(e) {
  return (isObject(e) && objectToString(e) === '[object Error]') || (e instanceof Error);
}
exports.isError = isError;

exports.inspect = require('util').inspect;

exports.AssertionError = require('assert').AssertionError;

var hasOwnProperty = Object.prototype.hasOwnProperty;

exports.forOwn = function(obj, f, context) {
  for(var prop in obj) {
    if(hasOwnProperty.call(obj, prop)) {
      f.call(context, obj[prop], prop);
    }
  }
};
},{"assert":17,"util":22}],17:[function(require,module,exports){
// http://wiki.commonjs.org/wiki/Unit_Testing/1.0
//
// THIS IS NOT TESTED NOR LIKELY TO WORK OUTSIDE V8!
//
// Originally from narwhal.js (http://narwhaljs.org)
// Copyright (c) 2009 Thomas Robinson <280north.com>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the 'Software'), to
// deal in the Software without restriction, including without limitation the
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
// sell copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
// ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

// when used in node, this will actually load the util module we depend on
// versus loading the builtin util module as happens otherwise
// this is a bug in node module loading as far as I am concerned
var util = require('util/');

var pSlice = Array.prototype.slice;
var hasOwn = Object.prototype.hasOwnProperty;

// 1. The assert module provides functions that throw
// AssertionError's when particular conditions are not met. The
// assert module must conform to the following interface.

var assert = module.exports = ok;

// 2. The AssertionError is defined in assert.
// new assert.AssertionError({ message: message,
//                             actual: actual,
//                             expected: expected })

assert.AssertionError = function AssertionError(options) {
  this.name = 'AssertionError';
  this.actual = options.actual;
  this.expected = options.expected;
  this.operator = options.operator;
  if (options.message) {
    this.message = options.message;
    this.generatedMessage = false;
  } else {
    this.message = getMessage(this);
    this.generatedMessage = true;
  }
  var stackStartFunction = options.stackStartFunction || fail;

  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, stackStartFunction);
  }
  else {
    // non v8 browsers so we can have a stacktrace
    var err = new Error();
    if (err.stack) {
      var out = err.stack;

      // try to strip useless frames
      var fn_name = stackStartFunction.name;
      var idx = out.indexOf('\n' + fn_name);
      if (idx >= 0) {
        // once we have located the function frame
        // we need to strip out everything before it (and its line)
        var next_line = out.indexOf('\n', idx + 1);
        out = out.substring(next_line + 1);
      }

      this.stack = out;
    }
  }
};

// assert.AssertionError instanceof Error
util.inherits(assert.AssertionError, Error);

function replacer(key, value) {
  if (util.isUndefined(value)) {
    return '' + value;
  }
  if (util.isNumber(value) && (isNaN(value) || !isFinite(value))) {
    return value.toString();
  }
  if (util.isFunction(value) || util.isRegExp(value)) {
    return value.toString();
  }
  return value;
}

function truncate(s, n) {
  if (util.isString(s)) {
    return s.length < n ? s : s.slice(0, n);
  } else {
    return s;
  }
}

function getMessage(self) {
  return truncate(JSON.stringify(self.actual, replacer), 128) + ' ' +
         self.operator + ' ' +
         truncate(JSON.stringify(self.expected, replacer), 128);
}

// At present only the three keys mentioned above are used and
// understood by the spec. Implementations or sub modules can pass
// other keys to the AssertionError's constructor - they will be
// ignored.

// 3. All of the following functions must throw an AssertionError
// when a corresponding condition is not met, with a message that
// may be undefined if not provided.  All assertion methods provide
// both the actual and expected values to the assertion error for
// display purposes.

function fail(actual, expected, message, operator, stackStartFunction) {
  throw new assert.AssertionError({
    message: message,
    actual: actual,
    expected: expected,
    operator: operator,
    stackStartFunction: stackStartFunction
  });
}

// EXTENSION! allows for well behaved errors defined elsewhere.
assert.fail = fail;

// 4. Pure assertion tests whether a value is truthy, as determined
// by !!guard.
// assert.ok(guard, message_opt);
// This statement is equivalent to assert.equal(true, !!guard,
// message_opt);. To test strictly for the value true, use
// assert.strictEqual(true, guard, message_opt);.

function ok(value, message) {
  if (!value) fail(value, true, message, '==', assert.ok);
}
assert.ok = ok;

// 5. The equality assertion tests shallow, coercive equality with
// ==.
// assert.equal(actual, expected, message_opt);

assert.equal = function equal(actual, expected, message) {
  if (actual != expected) fail(actual, expected, message, '==', assert.equal);
};

// 6. The non-equality assertion tests for whether two objects are not equal
// with != assert.notEqual(actual, expected, message_opt);

assert.notEqual = function notEqual(actual, expected, message) {
  if (actual == expected) {
    fail(actual, expected, message, '!=', assert.notEqual);
  }
};

// 7. The equivalence assertion tests a deep equality relation.
// assert.deepEqual(actual, expected, message_opt);

assert.deepEqual = function deepEqual(actual, expected, message) {
  if (!_deepEqual(actual, expected)) {
    fail(actual, expected, message, 'deepEqual', assert.deepEqual);
  }
};

function _deepEqual(actual, expected) {
  // 7.1. All identical values are equivalent, as determined by ===.
  if (actual === expected) {
    return true;

  } else if (util.isBuffer(actual) && util.isBuffer(expected)) {
    if (actual.length != expected.length) return false;

    for (var i = 0; i < actual.length; i++) {
      if (actual[i] !== expected[i]) return false;
    }

    return true;

  // 7.2. If the expected value is a Date object, the actual value is
  // equivalent if it is also a Date object that refers to the same time.
  } else if (util.isDate(actual) && util.isDate(expected)) {
    return actual.getTime() === expected.getTime();

  // 7.3 If the expected value is a RegExp object, the actual value is
  // equivalent if it is also a RegExp object with the same source and
  // properties (`global`, `multiline`, `lastIndex`, `ignoreCase`).
  } else if (util.isRegExp(actual) && util.isRegExp(expected)) {
    return actual.source === expected.source &&
           actual.global === expected.global &&
           actual.multiline === expected.multiline &&
           actual.lastIndex === expected.lastIndex &&
           actual.ignoreCase === expected.ignoreCase;

  // 7.4. Other pairs that do not both pass typeof value == 'object',
  // equivalence is determined by ==.
  } else if (!util.isObject(actual) && !util.isObject(expected)) {
    return actual == expected;

  // 7.5 For all other Object pairs, including Array objects, equivalence is
  // determined by having the same number of owned properties (as verified
  // with Object.prototype.hasOwnProperty.call), the same set of keys
  // (although not necessarily the same order), equivalent values for every
  // corresponding key, and an identical 'prototype' property. Note: this
  // accounts for both named and indexed properties on Arrays.
  } else {
    return objEquiv(actual, expected);
  }
}

function isArguments(object) {
  return Object.prototype.toString.call(object) == '[object Arguments]';
}

function objEquiv(a, b) {
  if (util.isNullOrUndefined(a) || util.isNullOrUndefined(b))
    return false;
  // an identical 'prototype' property.
  if (a.prototype !== b.prototype) return false;
  //~~~I've managed to break Object.keys through screwy arguments passing.
  //   Converting to array solves the problem.
  if (isArguments(a)) {
    if (!isArguments(b)) {
      return false;
    }
    a = pSlice.call(a);
    b = pSlice.call(b);
    return _deepEqual(a, b);
  }
  try {
    var ka = objectKeys(a),
        kb = objectKeys(b),
        key, i;
  } catch (e) {//happens when one is a string literal and the other isn't
    return false;
  }
  // having the same number of owned properties (keys incorporates
  // hasOwnProperty)
  if (ka.length != kb.length)
    return false;
  //the same set of keys (although not necessarily the same order),
  ka.sort();
  kb.sort();
  //~~~cheap key test
  for (i = ka.length - 1; i >= 0; i--) {
    if (ka[i] != kb[i])
      return false;
  }
  //equivalent values for every corresponding key, and
  //~~~possibly expensive deep test
  for (i = ka.length - 1; i >= 0; i--) {
    key = ka[i];
    if (!_deepEqual(a[key], b[key])) return false;
  }
  return true;
}

// 8. The non-equivalence assertion tests for any deep inequality.
// assert.notDeepEqual(actual, expected, message_opt);

assert.notDeepEqual = function notDeepEqual(actual, expected, message) {
  if (_deepEqual(actual, expected)) {
    fail(actual, expected, message, 'notDeepEqual', assert.notDeepEqual);
  }
};

// 9. The strict equality assertion tests strict equality, as determined by ===.
// assert.strictEqual(actual, expected, message_opt);

assert.strictEqual = function strictEqual(actual, expected, message) {
  if (actual !== expected) {
    fail(actual, expected, message, '===', assert.strictEqual);
  }
};

// 10. The strict non-equality assertion tests for strict inequality, as
// determined by !==.  assert.notStrictEqual(actual, expected, message_opt);

assert.notStrictEqual = function notStrictEqual(actual, expected, message) {
  if (actual === expected) {
    fail(actual, expected, message, '!==', assert.notStrictEqual);
  }
};

function expectedException(actual, expected) {
  if (!actual || !expected) {
    return false;
  }

  if (Object.prototype.toString.call(expected) == '[object RegExp]') {
    return expected.test(actual);
  } else if (actual instanceof expected) {
    return true;
  } else if (expected.call({}, actual) === true) {
    return true;
  }

  return false;
}

function _throws(shouldThrow, block, expected, message) {
  var actual;

  if (util.isString(expected)) {
    message = expected;
    expected = null;
  }

  try {
    block();
  } catch (e) {
    actual = e;
  }

  message = (expected && expected.name ? ' (' + expected.name + ').' : '.') +
            (message ? ' ' + message : '.');

  if (shouldThrow && !actual) {
    fail(actual, expected, 'Missing expected exception' + message);
  }

  if (!shouldThrow && expectedException(actual, expected)) {
    fail(actual, expected, 'Got unwanted exception' + message);
  }

  if ((shouldThrow && actual && expected &&
      !expectedException(actual, expected)) || (!shouldThrow && actual)) {
    throw actual;
  }
}

// 11. Expected to throw an error:
// assert.throws(block, Error_opt, message_opt);

assert.throws = function(block, /*optional*/error, /*optional*/message) {
  _throws.apply(this, [true].concat(pSlice.call(arguments)));
};

// EXTENSION! This is annoying to write outside this module.
assert.doesNotThrow = function(block, /*optional*/message) {
  _throws.apply(this, [false].concat(pSlice.call(arguments)));
};

assert.ifError = function(err) { if (err) {throw err;}};

var objectKeys = Object.keys || function (obj) {
  var keys = [];
  for (var key in obj) {
    if (hasOwn.call(obj, key)) keys.push(key);
  }
  return keys;
};

},{"util/":19}],18:[function(require,module,exports){
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],19:[function(require,module,exports){
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

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(global.process)) {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (process.noDeprecation === true) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnviron;
exports.debuglog = function(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = require('./support/isBuffer');

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = require('inherits');

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

},{"./support/isBuffer":18,"inherits":20}],20:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],21:[function(require,module,exports){
module.exports=require(18)
},{}],22:[function(require,module,exports){
module.exports=require(19)
},{"./support/isBuffer":21,"inherits":20}],23:[function(require,module,exports){
/**
 * Module dependencies.
 */

var should = require('../');
var util = require('util');

function err(fn, msg) {
  try {
    fn();
    should.fail('expected an error');
  } catch(err) {
    should.equal(msg, err.message);
  }
}

function err_should_exist(obj) {
  err(function() {
      should.exist(obj);
    },
      'expected ' + util.inspect(obj) + ' to exist');
}

function err_should_not_exist(obj) {
  err(function() {
      should.not.exist(obj);
    },
      'expected ' + util.inspect(obj) + ' to not exist');
}

describe('should.exist', function() {

  // static should.exist() pass,
  it('test static should.exist() pass w/ bool', function() {
    should.exist(false);
  });

  it('test static should.exist() pass w/ number', function() {
    should.exist(0);
  });

  it('test static should.exist() pass w/ string', function() {
    should.exist('');
  });

  it('test static should.exist() pass w/ object', function() {
    should.exist({});
  });

  it('test static should.exist() pass w/ array', function() {
    should.exist([]);
  });

  // static should.exist() fail,
  it('test static should.exist() fail w/ null', function() {
    err_should_exist(null);
  });

  it('test static should.exist() fail w/ undefined', function() {
    err_should_exist(undefined);
  });

  // static should.not.exist() pass,
  it('test static should.not.exist() pass w/ null', function() {
    should.not.exist(null);
  });

  it('test static should.not.exist() pass w/ undefined', function() {
    should.not.exist(undefined);
  });

// static should.not.exist() fail,
  it('test static should.not.exist() fail w/ bool', function() {
    err_should_not_exist(false);
  });

  it('test static should.not.exist() fail w/ number', function() {
    err_should_not_exist(0);
  });

  it('test static should.not.exist() fail w/ string', function() {
    err_should_not_exist('');
  });

  it('test static should.not.exist() fail w/ object', function() {
    err_should_not_exist({});
  });

  it('test static should.not.exist() fail w/ array', function() {
    err_should_not_exist([]);
  });

});

},{"../":14,"util":22}],24:[function(require,module,exports){
var err = require('../util').err;
var should = require('../../');

describe('bool', function() {
  it('test true', function() {
    true.should.be.true;
    false.should.not.be.true;
    (1).should.not.be.true;

    err(function(){
      'test'.should.be.true;
    }, "expected 'test' to be true")

    err(function(){
      true.should.not.be.true;
    }, "expected true not to be true")
  });

  it('test false', function() {
    false.should.be.false;
    true.should.not.be.false;
    (0).should.not.be.false;

    err(function(){
      ''.should.be.false;
    }, "expected '' to be false")

    err(function(){
      false.should.not.be.false;
    }, "expected false not to be false")
  });

  it('test ok', function() {
    true.should.be.ok;
    false.should.not.be.ok;
    (1).should.be.ok;
    (0).should.not.be.ok;

    err(function(){
      ''.should.be.ok;
    }, "expected '' to be truthy");

    err(function(){
      'test'.should.not.be.ok;
    }, "expected 'test' not to be truthy");
  });
});
},{"../../":14,"../util":35}],25:[function(require,module,exports){
var err = require('../util').err;
var should = require('../../');

describe('deprecated', function() {
  it('test include() with string', function() {
    'foobar'.should.include('bar');
    'foobar'.should.include('foo');
    'foobar'.should.not.include('baz');

    err(function(){
      'foobar'.should.include('baz');
    }, "expected 'foobar' to include 'baz'");

    err(function(){
      'foobar'.should.not.include('bar');
    }, "expected 'foobar' not to include 'bar'");

    err(function(){
      'foobar'.should.include('baz', 'foo');
    }, "foo");
  });

  it('test include() with array', function() {
    ['foo', 'bar'].should.include('foo');
    ['foo', 'bar'].should.include('foo');
    ['foo', 'bar'].should.include('bar');
    [1,2].should.include(1);
    ['foo', 'bar'].should.not.include('baz');
    ['foo', 'bar'].should.not.include(1);

    err(function(){
      ['foo'].should.include('bar');
    }, "expected [ 'foo' ] to include 'bar'");

    err(function(){
      ['bar', 'foo'].should.not.include('foo');
    }, "expected [ 'bar', 'foo' ] not to include 'foo'");

    err(function(){
      ['bar', 'foo'].should.not.include('foo', 'foo');
    }, "foo");
  });

  it('test include() with object', function() {
    var tobi = { name: 'Tobi', age: 2 };
    var jane = { name: 'Jane', age: 2 };

    var user = { name: 'TJ', pet: tobi, age: 24 };

    user.should.include({ pet: tobi });
    user.should.include({ pet: tobi, name: 'TJ' });
    user.should.not.include({ pet: tobi, name: 'Someone else' });
    user.should.not.include({ pet: jane });
    user.should.not.include({ pet: jane, name: 'TJ' });

    err(function(){
      user.should.include({ pet: { name: 'Luna' } });
    }, "expected { name: 'TJ', pet: { name: 'Tobi', age: 2 }, age: 24 } to include an object equal to { pet: { name: 'Luna' } }");
  });

  it('test includeEql() with array', function() {
    [['foo'], ['bar']].should.includeEql(['foo']);
    [['foo'], ['bar']].should.includeEql(['bar']);
    [['foo'], ['bar']].should.not.includeEql(['baz']);
    [].should.not.includeEql(['baz']);

    err(function(){
      [['foo']].should.includeEql(['bar']);
    }, "expected [ [ 'foo' ] ] to include an object equal to [ 'bar' ]");

    err(function(){
      [['foo']].should.not.includeEql(['foo']);
    }, "expected [ [ 'foo' ] ] not to include an object equal to [ 'foo' ]");

    err(function(){
      [['foo']].should.not.includeEql(['foo'], 'foo');
    }, "foo");
  });
});
},{"../../":14,"../util":35}],26:[function(require,module,exports){
var err = require('../util').err,
	should = require('../../');

describe('eql', function() {
  it('test eql(val)', function() {
    'test'.should.eql('test');
    ({ foo: 'bar' }).should.eql({ foo: 'bar' });
    (1).should.eql(1);
    '4'.should.eql(4);
    var memo = [];
    function memorize() {
        memo.push(arguments);
    }
    memorize('a', [1, 2]);
    memorize('a', [1, 2]);
    memo[0].should.eql(memo[1]);

    err(function(){
      (4).should.eql(3);
    }, 'expected 4 to equal 3');
  });

  it('test equal(val)', function() {
    'test'.should.equal('test');
    (1).should.equal(1);

    err(function(){
      (4).should.equal(3);
    }, 'expected 4 to be 3');

    err(function(){
      '4'.should.equal(4);
    }, "expected '4' to be 4");

    var date = new Date;
    date.should.equal(date);
  });

  it('test .equal()', function() {
    var foo;
    should.equal(undefined, foo);
  });
});
},{"../../":14,"../util":35}],27:[function(require,module,exports){
var err = require('../util').err,
	should = require('../../');

describe('error', function() {
  it('test throw()', function() {
    (function(){}).should.not.throw();
    (function(){ throw new Error('fail') }).should.throw();

    err(function(){
      (function(){}).should.throw();
    }, 'expected [Function] to throw exception');

    err(function(){
      (function(){
        throw new Error('fail');
      }).should.not.throw();
    }, 'expected [Function] not to throw exception (got [Error: fail])');
  });

  it('test throw() with regex message', function() {
    (function(){ throw new Error('fail'); }).should.throw(/fail/);

    err(function(){
      (function(){}).should.throw(/fail/);
    }, 'expected [Function] to throw exception');

    err(function(){
      (function(){ throw new Error('error'); }).should.throw(/fail/);
    }, "expected [Function] to throw exception with a message matching /fail/, but got 'error'");
  });

  it('test throw() with string message', function() {
    (function(){ throw new Error('fail'); }).should.throw('fail');

    err(function(){
      (function(){}).should.throw('fail');
    }, 'expected [Function] to throw exception');

    err(function(){
      (function(){ throw new Error('error'); }).should.throw('fail');
    }, "expected [Function] to throw exception with a message matching 'fail', but got 'error'");
  });

  it('test throw() with type', function() {
    (function(){ throw new Error('fail'); }).should.throw(Error);

    err(function(){
      (function(){}).should.throw(Error);
    }, 'expected [Function] to throw exception');

    err(function(){
      (function(){ throw 'error'; }).should.throw(Error);
    }, "expected [Function] to throw exception of type Error, but got String");
  });

  it('test throwError()', function() {
    (function(){}).should.not.throwError();
    (function(){ throw new Error('fail') }).should.throwError();

    err(function(){
      (function(){}).should.throwError();
    }, 'expected [Function] to throw exception');

    err(function(){
      (function(){
        throw new Error('fail');
      }).should.not.throwError();
    }, 'expected [Function] not to throw exception (got [Error: fail])');
  });

  it('test throwError() with regex message', function() {
    (function(){ throw new Error('fail'); }).should.throwError(/fail/);

    err(function(){
      (function(){}).should.throwError(/fail/);
    }, 'expected [Function] to throw exception');

    err(function(){
      (function(){ throw new Error('error'); }).should.throwError(/fail/);
    }, "expected [Function] to throw exception with a message matching /fail/, but got 'error'");
  });

  it('test throwError() with string message', function() {
    (function(){ throw new Error('fail'); }).should.throwError('fail');

    err(function(){
      (function(){}).should.throwError('fail');
    }, 'expected [Function] to throw exception');

    err(function(){
      (function(){ throw new Error('error'); }).should.throwError('fail');
    }, "expected [Function] to throw exception with a message matching 'fail', but got 'error'");
  });

  it('test throwError() with type', function() {
    (function(){ throw new Error('fail'); }).should.throw(Error);

    err(function(){
      (function(){}).should.throw(Error);
    }, 'expected [Function] to throw exception');

    err(function(){
      (function(){ throw 'error'; }).should.throw(Error);
    }, "expected [Function] to throw exception of type Error, but got String");
  });
});
},{"../../":14,"../util":35}],28:[function(require,module,exports){
var err = require('../util').err;
var should = require('../../');

describe('http', function() {
  it('test .json', function() {
    var req = {
      headers: {
        'content-type': 'application/json'
      }
    };

    req.should.be.json;

    req = {
      headers: {
        'content-type': 'application/json; charset=utf-8'
      }
    };

    req.should.be.json;

    req = {
      headers: {
        'content-type': 'text/html'
      }
    };

    req.should.not.be.json;

    ({}).should.not.be.json;
  });

  it('test .status', function() {
    ({ statusCode: 300 }).should.have.not.status(200);

    ({ statusCode: 200 }).should.have.status(200);
  });

  it('test .header', function () {
    ({
      headers: {
        'content-type': 'image/x-icon',
        'content-length': '318',
        etag: '"4acba26164356285e6908e8bf0529fab"',
        'cache-control': 'public, max-age=86400',
        'x-response-time': '1ms',
        date: 'Wed, 19 Feb 2014 05:20:55 GMT',
        connection: 'close'
      }
    }).should.header('Content-Type', 'image/x-icon');

    ({
      headers: {
        'content-type': 'image/x-icon',
        'content-length': '318',
        etag: '"4acba26164356285e6908e8bf0529fab"',
        'cache-control': 'public, max-age=86400',
        'x-response-time': '1ms',
        date: 'Wed, 19 Feb 2014 05:20:55 GMT',
        connection: 'close'
      }
    }).should.header('Content-Type');

  });
});

},{"../../":14,"../util":35}],29:[function(require,module,exports){
var err = require('../util').err;
var should = require('../../');

describe('match', function() {

  it('test string match(regexp)', function() {
    'foobar'.should.match(/^foo/)
    'foobar'.should.not.match(/^bar/)

    err(function() {
      'foobar'.should.match(/^bar/i)
    }, "expected 'foobar' to match /^bar/i");

    err(function() {
      'foobar'.should.not.match(/^foo/i)
    }, "expected 'foobar' not to match /^foo/i");

    err(function() {
      'foobar'.should.match(/^bar/i, 'foo')
    }, "foo");

    err(function() {
      'foobar'.should.not.match(/^foo/i, 'foo')
    }, "foo");
  });

  it('test object match(regexp)', function() {
    ({ a: 'foo', c: 'barfoo' }).should.match(/foo$/);

    ({ a: 'a' }).should.not.match(/^http/);

    // positive false
    err(function() {
      ({ a: 'foo', c: 'barfoo' }).should.not.match(/foo$/);
    }, "expected { a: 'foo', c: 'barfoo' } not to match /foo$/\n\tmatched properties: 'a', 'c'");

    // negative true
    err(function() {
      ({ a: 'foo', c: 'barfoo' }).should.match(/^foo$/);
    }, "expected { a: 'foo', c: 'barfoo' } to match /^foo$/\n\tnot matched properties: 'c'\n\tmatched properties: 'a'");
  });

  it('test array match(regexp)', function() {
    ['a', 'b', 'c'].should.match(/[a-z]/);
    ['a', 'b', 'c'].should.not.match(/[d-z]/);

    err(function() {
      ['a', 'b', 'c'].should.not.match(/[a-z]/);
    }, "expected [ 'a', 'b', 'c' ] not to match /[a-z]/");

    err(function() {
      ['a', 'b', 'c'].should.match(/[d-z]/);
    }, "expected [ 'a', 'b', 'c' ] to match /[d-z]/");
  });

  it('test match(function)', function() {
    (5).should.match(function(n) {
      return n > 0;
    });

    (5).should.not.match(function(n) {
      return n < 0;
    });

    (5).should.not.match(function(it) {
      it.should.be.an.Array;
    });

    (5).should.match(function(it) {
      it.should.be.a.Number;
    });

    err(function() {
      (5).should.match(function(n) {
        return n < 0;
      });
    }, "expected 5 to match [Function]");

    err(function() {
      (5).should.match(function(it) {
        it.should.be.an.Array;
      });
    }, "expected 5 to match [Function]\n\texpected 5 to be an array");

    err(function() {
      (5).should.not.match(function(it) {
        return it.should.be.a.Number;
      });
    }, "expected 5 not to match [Function]\n\texpected 5 to be a number");

    err(function() {
      (5).should.not.match(function(n) {
        return n > 0;
      });
    }, "expected 5 not to match [Function]");
  });

  it('test match(object)', function() {
    ({ a: 10, b: 'abc', c: { d: 10 }, d: 0 }).should
      .match({ a: 10, b: /c$/, c: function(it) {
        return it.should.have.property('d', 10);
      }});

    [10, 'abc', { d: 10 }, 0].should
      .match({ '0': 10, '1': /c$/, '2': function(it) {
        return it.should.have.property('d', 10);
      } });

    [10, 'abc', { d: 10 }, 0].should
      .match([10, /c$/, function(it) {
        return it.should.have.property('d', 10);
      }]);

    err(function() {
      ({ a: 10, b: 'abc', c: { d: 10 }, d: 0 }).should
        .match({ a: 11, b: /c$/, c: function(it) {
          return it.should.have.property('d', 10);
        }});
    }, "expected { a: 10, b: 'abc', c: { d: 10 }, d: 0 } to match { a: 11, b: /c$/, c: [Function] }\n\tnot matched properties: a\n\tmatched properties: b, c");

    err(function() {
      ({ a: 10, b: 'abc', c: { d: 10 }, d: 0 }).should.not
        .match({ a: 10, b: /c$/, c: function(it) {
          return it.should.have.property('d', 10);
        }});
    }, "expected { a: 10, b: 'abc', c: { d: 10 }, d: 0 } not to match { a: 10, b: /c$/, c: [Function] }\n\tmatched properties: a, b, c");
  });

  it('test each property match(function)', function() {
    [10, 11, 12].should.matchEach(function(it) {
      return it >= 10;
    });

    [10, 10].should.matchEach(10);

    ({ a: 10, b: 11, c: 12}).should.matchEach(function(value, key) {
      value.should.be.a.Number;
    });

    (['a', 'b', 'c']).should.matchEach(/[a-c]/);

    err(function() {
      (['a', 'b', 'c']).should.not.matchEach(/[a-c]/);
    }, "expected [ 'a', 'b', 'c' ] not to match each /[a-c]/");

    err(function() {
      [10, 11].should.matchEach(10);
    }, "expected [ 10, 11 ] to match each 10");
  });
});
},{"../../":14,"../util":35}],30:[function(require,module,exports){
var err = require('../util').err;
var should = require('../../');

describe('number', function() {
  it('test NaN', function() {
    NaN.should.be.NaN;
    Infinity.should.not.be.NaN;
    (0).should.not.be.NaN;
    false.should.not.be.NaN;
    ({}).should.not.be.NaN;
    ''.should.not.be.NaN;
    'foo'.should.not.be.NaN;
    /^$/.should.not.be.NaN;

    err(function(){
      Infinity.should.be.NaN;
    }, "expected Infinity to be NaN")

    err(function(){
      NaN.should.not.be.NaN;
    }, "expected NaN not to be NaN")
  });

  it('test Infinity', function() {
    NaN.should.not.be.Infinity;
    (1/0).should.be.Infinity;
    Infinity.should.be.Infinity;
    (0).should.not.be.Infinity;
    false.should.not.be.Infinity;
    ({}).should.not.be.Infinity;
    ''.should.not.be.Infinity;
    'foo'.should.not.be.Infinity;
    /^$/.should.not.be.Infinity;

    err(function(){
      NaN.should.be.Infinity;
    }, "expected NaN to be Infinity")

    err(function(){
      Infinity.should.not.be.Infinity;
    }, "expected Infinity not to be Infinity")
  });

  it('test within(start,  it(finish)', function() {
    (5).should.be.within(5, 10);
    (5).should.be.within(3,6);
    (5).should.be.within(3,5);
    (5).should.not.be.within(1,3);

    err(function(){
      (5).should.not.be.within(4,6);
    }, "expected 5 not to be within 4..6");

    err(function(){
      (10).should.be.within(50,100);
    }, "expected 10 to be within 50..100");

    err(function(){
      (5).should.not.be.within(4,6, 'foo');
    }, "foo");

    err(function(){
      (10).should.be.within(50,100, 'foo');
    }, "foo");
  });

  it('test approximately(number,  it(delta)', function() {
    (1.5).should.be.approximately(1.4, 0.2);
    (1.5).should.be.approximately(1.5, 10E-10);
    (1.5).should.not.be.approximately(1.4, 1E-2);

    err(function(){
      (99.99).should.not.be.approximately(100, 0.1);
    }, "expected 99.99 not to be approximately 100 ±0.1");

    err(function(){
      (99.99).should.be.approximately(105, 0.1);
    }, "expected 99.99 to be approximately 105 ±0.1");
  });


  it('test above(n)', function() {
    (5).should.be.above(2);
    (5).should.be.greaterThan(2);
    (5).should.not.be.above(5);
    (5).should.not.be.above(6);

    err(function(){
      (5).should.be.above(6);
    }, "expected 5 to be above 6");

    err(function(){
      (10).should.not.be.above(6);
    }, "expected 10 not to be above 6");

    err(function(){
      (5).should.be.above(6, 'foo');
    }, "foo");

    err(function(){
      (10).should.not.be.above(6, 'foo');
    }, "foo");
  });

  it('test below(n)', function() {
    (2).should.be.below(5);
    (2).should.be.lessThan(5);
    (5).should.not.be.below(5);
    (6).should.not.be.below(5);

    err(function(){
      (6).should.be.below(5);
    }, "expected 6 to be below 5");

    err(function(){
      (6).should.not.be.below(10);
    }, "expected 6 not to be below 10");

    err(function(){
      (6).should.be.below(5, 'foo');
    }, "foo");

    err(function(){
      (6).should.not.be.below(10, 'foo');
    }, "foo");
  });
});
},{"../../":14,"../util":35}],31:[function(require,module,exports){
var err = require('../util').err;
var should = require('../../');

describe('property', function() {
  it('test enumerable(name)', function() {
    ({'length': 5}).should.have.enumerable('length');
    (4).should.not.have.enumerable('length');

    err(function() {
      'asd'.should.have.enumerable('length');
    }, "expected 'asd' to have enumerable property 'length'");
  });

  it('test enumerable(name,  it(val)', function() {
    ({'length': 5}).should.have.enumerable('length', 5);

    err(function() {
      ({'length': 3}).should.have.enumerable('length', 5);
    }, "expected { length: 3 } to have enumerable property 'length' equal to '5'");
  });

  it('test property(name)', function() {
    'test'.should.have.property('length');
    (4).should.not.have.property('length');

    err(function() {
      'asd'.should.have.property('foo');
    }, "expected 'asd' to have property 'foo'");
  });

  it('test property(name,  it(val)', function() {
    'test'.should.have.property('length', 4);
    'asd'.should.have.property('constructor', String);

    err(function() {
      'asd'.should.have.property('length', 4);
    }, "expected 'asd' to have property 'length' of 4 (got 3)");

    err(function() {
      'asd'.should.not.have.property('length', 3);
    }, "expected 'asd' not to have property 'length' of 3");

    err(function() {
      'asd'.should.have.property('constructor', Number);
    }, "expected 'asd' to have property 'constructor' of [Function: Number] (got [Function: String])");

    err(function() {
      ({a: {b: 1}}).should.have.property('a')
        .and.have.property('b', 100);
    }, "expected { b: 1 } to have property 'b' of 100 (got 1)");

    err(function() {
      ({a: {b: 1}}).should.have.property('a')
        .and.have.property('c', 100);
    }, "expected { b: 1 } to have property 'c'");

    err(function() {
      ({a: {b: 1}}).should.have.property('a')
        .and.have.property('c');
    }, "expected { b: 1 } to have property 'c'");

  });

  it('test length(n)', function() {
    'test'.should.have.length(4);
    'test'.should.have.lengthOf(4);
    'test'.should.not.have.length(3);
    [1, 2, 3].should.have.length(3);
    ({ length: 10}).should.have.length(10);

    err(function() {
      (4).should.have.length(3);
    }, "expected 4 to have property 'length'");

    err(function() {
      'asd'.should.not.have.length(3);
    }, "expected 'asd' not to have property 'length' of 3");

  });

  it('test ownProperty(name)', function() {
    'test'.should.have.ownProperty('length');
    ({ length: 12 }).should.have.ownProperty('length');

    err(function() {
      ({ length: 12 }).should.not.have.ownProperty('length');
    }, "expected { length: 12 } not to have own property 'length'");

    err(function() {
      ({ length: 12 }).should.not.have.ownProperty('length', 'foo');
    }, "foo");

    err(function() {
      ({ length: 12 }).should.have.ownProperty('foo', 'foo');
    }, "foo");
  });

  it('test ownProperty(name).equal(val)', function() {
    ({length: 10}).should.have.ownProperty('length').equal(10);
  });

  it('test properties(name1, name2,  it(...)', function() {
    'test'.should.have.properties('length', 'indexOf');
    (4).should.not.have.properties('length');

    err(function() {
      'asd'.should.have.properties('foo');
    }, "expected 'asd' to have property 'foo'");

    err(function() {
      'asd'.should.not.have.properties('length', 'indexOf');
    }, "expected 'asd' not to have properties 'length', 'indexOf'");
  });

  it('test properties([names])', function() {
    'test'.should.have.properties(['length', 'indexOf']);
    (4).should.not.have.properties(['length']);

    err(function() {
      'asd'.should.have.properties(['foo']);
    }, "expected 'asd' to have property 'foo'");
  });

  it('test any of properties', function() {
    'test'.should.have.any.of.properties('length', 'a', 'b');

    'test'.should.have.any.of.properties('length');

    ({ a: 10 }).should.have.any.of.properties('a', 'b');

    ({ a: 10 }).should.have.any.of.properties({ a: 10, b: 12 });

    ({ a: 10 }).should.not.have.any.of.properties('b', 'c');

    ({ a: 10 }).should.have.any.of.properties(['a', 'b']);

    err(function() {
      ({ a: 10 }).should.not.have.any.of.properties(['a', 'b']);
    }, "expected { a: 10 } not to have property 'a'");

    err(function() {
      ({ a: 10, b: 10 }).should.not.have.any.of.properties(['a', 'b']);
    }, "expected { a: 10, b: 10 } not to have any of properties 'a', 'b'");

    err(function() {
      ({ a: 10, b: 10 }).should.not.have.any.of.properties({ a: 10, b: 12 });
    }, "expected { a: 10, b: 10 } not to have property 'a' of 10");

    err(function() {
      ({ a: 10, b: 10 }).should.not.have.any.of.properties({ a: 10, b: 10 });
    }, "expected { a: 10, b: 10 } not to have any of properties 'a' of 10, 'b' of 10");

    err(function() {
      ({ a: 11, b: 11 }).should.have.any.of.properties({ a: 10, b: 10 });
    }, "expected { a: 11, b: 11 } to have any of properties 'a' of 10 (got 11), 'b' of 10 (got 11)");
  });

  it('test keys(array)', function() {
    ({ foo: 1 }).should.have.keys(['foo']);
    ({ foo: 1, bar: 2 }).should.have.keys(['foo', 'bar']);
    ({ foo: 1, bar: 2 }).should.have.keys('foo', 'bar');
    ({}).should.have.keys();
    ({}).should.have.keys([]);

    err(function() {
      ({ foo: 1 }).should.have.keys(['bar']);
    }, "expected { foo: 1 } to have key 'bar'\n\tmissing keys: 'bar'\n\textra keys: 'foo'");

    err(function() {
      ({ foo: 1 }).should.have.keys(['bar', 'baz']);
    }, "expected { foo: 1 } to have keys 'bar', 'baz'\n\tmissing keys: 'bar', 'baz'\n\textra keys: 'foo'");

    err(function() {
      ({ foo: 1 }).should.not.have.keys('foo');
    }, "expected { foo: 1 } not to have key 'foo'");

    err(function() {
      ({ foo: 1 }).should.not.have.keys(['foo']);
    }, "expected { foo: 1 } not to have key 'foo'");

    err(function() {
      ({ foo: 1, bar: 2 }).should.not.have.keys(['foo', 'bar']);
    }, "expected { foo: 1, bar: 2 } not to have keys 'foo', 'bar'");
  });

  it('test empty', function() {
    ''.should.be.empty;
    [].should.be.empty;
    ({}).should.be.empty;
    ({ length: 10 }).should.not.be.empty;

    (function() {
      arguments.should.be.empty;
    })();

    err(function() {
      ({}).should.not.be.empty;
    }, 'expected {} not to be empty');

    err(function() {
      ({ length: 10 }).should.be.empty;
    }, 'expected { length: 10 } to be empty');

    err(function() {
      'asd'.should.be.empty;
    }, "expected 'asd' to be empty");

    err(function() {
      ''.should.not.be.empty;
    }, "expected '' not to be empty");
  });

  it('test containEql', function() {
    'hello boy'.should.containEql('boy');
    [1, 2, 3].should.containEql(3);
    [
      [1],
      [2],
      [3]
    ].should.containEql([3]);
    [
      [1],
      [2],
      [3, 4]
    ].should.not.containEql([3]);
    [
      {a: 'a'},
      {b: 'b', c: 'c'}
    ].should.containEql({a: 'a'});
    [
      {a: 'a'},
      {b: 'b', c: 'c'}
    ].should.not.containEql({b: 'b'});

    ({}).should.not.containEql({ a: 10 });

    ({ b: 10 }).should.containEql({ b: 10 });
    [1, 2, 3].should.containEql(1);
    ([1, 2, { a: 10 }]).should.containEql({ a: 10 });
    [1, 2, 3].should.not.containEql({ a: 1 });

    err(function() {
      [1, 2, 3].should.not.containEql(3);
    }, "expected [ 1, 2, 3 ] not to contain 3");

    err(function() {
      [1, 2, 3].should.containEql(4);
    }, "expected [ 1, 2, 3 ] to contain 4");
  });

  it('test containDeep', function() {
    'hello boy'.should.containDeep('boy');

    ({ a: { b: 10 }, b: { c: 10, d: 11, a: { b: 10, c: 11} }}).should
      .containDeep({ a: { b: 10 }, b: { c: 10, a: { c: 11 }}});

    [1, 2, 3, { a: { b: { d: 12 }}}].should.containDeep([
      { a: { b: {d: 12}}}
    ]);

    [
      [1, [2, 3], 3],
      [2]
    ].should.not.containDeep([1, 2]);

    [
      [1],
      [2],
      [3]
    ].should.containDeep([
        [3]
      ]);
    [
      [1],
      [2],
      [3, 4]
    ].should.containDeep([
        [3]
      ]);
    [
      [1],
      [2],
      [3, 4]
    ].should.containDeep([
        [1],
        [3]
      ]);
    [
      [1],
      [2],
      [3, 4]
    ].should.not.containDeep([
        [3],
        [1]
      ]);
    [
      {a: 'a'},
      {b: 'b', c: 'c'}
    ].should.containDeep([
        {a: 'a'}
      ]);
    [
      {a: 'a'},
      {b: 'b', c: 'c'}
    ].should.containDeep([
        {b: 'b'}
      ]);

    err(function() {
      'hello boy'.should.not.containDeep('boy');
    }, "expected 'hello boy' not to contain 'boy'");

    err(function() {
      [
        {a: 'a'},
        {b: 'b', c: 'c'}
      ].should.not.containDeep([
          {b: 'b'}
        ]);
    }, "expected [ { a: 'a' }, { b: 'b', c: 'c' } ] not to contain [ { b: 'b' } ]");
  });
});

},{"../../":14,"../util":35}],32:[function(require,module,exports){
var err = require('../util').err;
var should = require('../../');

describe('string', function() {
  it('test startWith()', function() {
    'foobar'.should.startWith('foo');
    'foobar'.should.not.startWith('bar');

    err(function() {
      'foobar'.should.startWith('bar');
    }, "expected 'foobar' to start with 'bar'");

    err(function() {
      'foobar'.should.not.startWith('foo');
    }, "expected 'foobar' not to start with 'foo'");

    err(function() {
      'foobar'.should.startWith('bar', 'baz');
    }, "baz");

    err(function() {
      'foobar'.should.not.startWith('foo', 'baz');
    }, "baz");
  });

  it('test endWith()', function() {
    'foobar'.should.endWith('bar');
    'foobar'.should.not.endWith('foo');

    err(function() {
      'foobar'.should.endWith('foo');
    }, "expected 'foobar' to end with 'foo'");

    err(function() {
      'foobar'.should.not.endWith('bar');
    }, "expected 'foobar' not to end with 'bar'");

    err(function() {
      'foobar'.should.endWith('foo', 'baz');
    }, "baz");

    err(function() {
      'foobar'.should.not.endWith('bar', 'baz');
    }, "baz");
  });

});
},{"../../":14,"../util":35}],33:[function(require,module,exports){
var err = require('../util').err,
  should = require('../../');

var AssertionError = require('assert').AssertionError;
var util = require('util');

describe('type', function() {
  it('test arguments', function() {
    var args = (function(){ return arguments; })(1,2,3);
    args.should.be.arguments;
    [].should.not.be.arguments;

    err(function() {
      ((function(){ return arguments; })(1,2,3)).should.not.be.arguments;
    }, "expected { '0': 1, '1': 2, '2': 3 } not to be arguments");

    err(function() {
      ({}).should.be.arguments;
    }, "expected {} to be arguments");
  });

  it('test typeof', function() {
    'test'.should.have.type('string');

    err(function(){
      'test'.should.not.have.type('string');
    }, "expected 'test' not to have type string");

    err(function(){
      'test'.should.not.have.type('string', 'foo');
    }, "foo");

    err(function(){
      (10).should.have.type('string');
    }, "expected 10 to have type string");

    (5).should.have.type('number');

    err(function(){
      (5).should.not.have.type('number');
    }, "expected 5 not to have type number");

    err(function(){
      (5).should.not.have.type('number', 'foo');
    }, "foo");
  });

  it('test instanceof', function() {
    function Foo(){}
    new Foo().should.be.an.instanceof(Foo);

    new Date().should.be.an.instanceof(Date);

    var tobi = { name: 'Tobi', age: 2 };
    tobi.should.be.an.instanceof(Object);

    var getSomething = function() {return "something"};
    getSomething.should.be.an.instanceof(Function);

    var number = Object(5);
    (number instanceof Number).should.be.true;
    number.should.be.an.instanceof(Number);

    var boolean = Object(true);
    (boolean instanceof Boolean).should.be.true;
    boolean.should.be.an.instanceof(Boolean);

    var string = Object('string');
    (string instanceof String).should.be.true;
    string.should.be.an.instanceof(String);

    err(function(){
      (3).should.an.instanceof(Foo);
    }, "expected 3 to be an instance of Foo");

    err(function(){
      (3).should.an.instanceof(Foo, 'foo');
    }, "foo");

    err(function(){
      ({}).should.not.be.an.instanceof(Object);
    }, "expected {} not to be an instance of Object");
  });

  it('test instanceOf (non-  it(reserved)', function() {
    function Foo(){}
    new Foo().should.be.an.instanceOf(Foo);

    new Date().should.be.an.instanceOf(Date);

    var tobi = { name: 'Tobi', age: 2 };
    tobi.should.be.an.instanceOf(Object);

    var getSomething = function() {return "something"};
    getSomething.should.be.an.instanceOf(Function);

    err(function(){
      (9).should.an.instanceOf(Foo);
    }, "expected 9 to be an instance of Foo");

    err(function(){
      (9).should.an.instanceOf(Foo, 'foo');
    }, "foo");

    function Foo2(){}
    Foo2.prototype.valueOf = function (){ return 'foo'; };
    new Foo2().should.be.an.instanceOf(Foo2);
  });

  it('test Function', function() {
    var f = function() {};
    f.should.be.a.Function;

    Object.should.be.a.Function;

    Function.should.be.a.Function;

    (new Function("1 * 1")).should.be.a.Function;

    err(function() {
      (1).should.be.a.Function;
    }, "expected 1 to be a function");
  });

  it('test Object', function() {
    ({}).should.be.an.Object;
    Function.should.not.be.an.Object;

    (new Object()).should.be.an.Object;
    (new Date()).should.be.an.Object;

    err(function() {
      (1).should.be.an.Object;
    }, 'expected 1 to be an object');
  });

  it('test String', function() {
    ''.should.be.a.String;
    ({}).should.not.be.a.String;
    (0).should.not.be.a.String;

    (new String("")).should.be.a.String;

    err(function() {
      (1).should.be.a.String
    }, 'expected 1 to be a string');
  });

  it('test Array', function() {
    [].should.be.an.Array;
    (new Array(10)).should.be.an.Array;

    ''.should.not.be.Array;
    (1).should.not.be.Array;

    err(function() {
      [].should.not.be.Array
    }, 'expected [] not to be an array');
  });

  it('test Number', function() {
    (1).should.be.a.Number;
    (new Number(10)).should.be.a.Number;

    NaN.should.be.a.Number;
    Infinity.should.be.a.Number;

    ({}).should.not.be.a.Number;

    err(function() {
      ([]).should.be.a.Number;
    }, 'expected [] to be a number');
  });
  it('test Boolean', function() {
    (true).should.be.a.Boolean;
    (false).should.be.a.Boolean;

    (new Boolean(false)).should.be.a.Boolean;

    ({}).should.not.be.a.Boolean;

    err(function() {
      [].should.be.a.Boolean;
    }, 'expected [] to be a boolean');
  });
  it('test Error', function() {
    (new Error()).should.be.an.Error;

    ({}).should.not.be.Error;

    var ae = new AssertionError({ actual: 10 });
    ae.should.be.an.Error;

    var AsyncTimeoutError = function AsyncTimeoutError(msg) {
      msg && (this.message = msg);
      Error.apply(this, arguments);
      Error.captureStackTrace && Error.captureStackTrace(this, AsyncTimeoutError);
    };
    util.inherits(AsyncTimeoutError, Error);
    AsyncTimeoutError.prototype.name = AsyncTimeoutError.name;

    var e = new AsyncTimeoutError('foo');
    e.should.be.an.Error;

    err(function() {
      ([]).should.be.an.Error;
    }, 'expected [] to be an error');
  });
});
},{"../../":14,"../util":35,"assert":17,"util":22}],34:[function(require,module,exports){

/**
 * Module dependencies.
 */

var should = require('../')
  , assert = require('assert');

function err(fn, msg) {
  try {
    fn();
    should.fail('expected an error');
  } catch (err) {
    should.equal(msg, err.message);
  }
}

describe('should', function() {
  it('test double require', function() {
    require('../').should.equal(should);
  });

  it('test assertion', function() {
    'test'.should.be.a.string;
    should.equal('foo', 'foo');
  });
  
  it('test .expected and .actual', function() {
    try {
      'foo'.should.equal('bar');
    } catch (err) {
      assert('foo' == err.actual, 'err.actual');
      assert('bar' == err.expected, 'err.expected');
    }
  });
 
  it('test chaining', function() {
    var user = { name: 'tj', pets: ['tobi', 'loki', 'jane', 'bandit'] };

    user.should.be.an.instanceOf(Object).and.have.property('name', 'tj');

    user.should.have.ownProperty('name')
      .which.not.have.length(3)
        .and.be.equal('tj');
  });
});

},{"../":14,"assert":17}],35:[function(require,module,exports){
var should = require('../');

function err(fn, msg) {
  var ok = true;
  try {
    fn();
    ok = false;
  } catch (err) {
    if(err.message !== msg)
      throw new should.AssertionError({ message: 'Expected message does not match', expected: msg, actual: err.message });
  }
  if(!ok) throw new Error('expected an error');
}

exports.err = err;
},{"../":14}]},{},[23,24,25,26,27,28,29,30,31,32,33,34])