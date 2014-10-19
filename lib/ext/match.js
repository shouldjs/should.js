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
    this.params = {operator: 'to match ' + i(other), message: description};

    if(!eql(this.obj, other)) {
      if(util.isRegExp(other)) { // something - regex

        if(util.isString(this.obj)) {

          this.assert(other.exec(this.obj));
        } else if(util.isArray(this.obj)) {

          this.obj.forEach(function(item) {
            this.assert(other.exec(item));// should we try to convert to String and exec?
          }, this);
        } else if(util.isObject(this.obj)) {

          var notMatchedProps = [], matchedProps = [];
          util.forOwn(this.obj, function(value, name) {
            if(other.exec(value)) matchedProps.push(util.formatProp(name));
            else notMatchedProps.push(util.formatProp(name) + ' (' + i(value) + ')');
          }, this);

          if(notMatchedProps.length)
            this.params.operator += '\n    not matched properties: ' + notMatchedProps.join(', ');
          if(matchedProps.length)
            this.params.operator += '\n    matched properties: ' + matchedProps.join(', ');

          this.assert(notMatchedProps.length == 0);
        } // should we try to convert to String and exec?
      } else if(util.isFunction(other)) {
        var res;

        res = other(this.obj);

        if(res instanceof Assertion) {
          this.params.operator += '\n    ' + res.getMessage();
        }

        //if we throw exception ok - it is used .should inside
        if(util.isBoolean(res)) {
          this.assert(res); // if it is just boolean function assert on it
        }
      } else if(util.isObject(other)) { // try to match properties (for Object and Array)
        notMatchedProps = [];
        matchedProps = [];

        util.forOwn(other, function(value, key) {
          try {
            should(this.obj[key]).match(value);
            matchedProps.push(util.formatProp(key));
          } catch(e) {
            if(e instanceof should.AssertionError) {
              notMatchedProps.push(util.formatProp(key) + ' (' + i(this.obj[key]) + ')');
            } else {
              throw e;
            }
          }
        }, this);

        if(notMatchedProps.length)
          this.params.operator += '\n    not matched properties: ' + notMatchedProps.join(', ');
        if(matchedProps.length)
          this.params.operator += '\n    matched properties: ' + matchedProps.join(', ');

        this.assert(notMatchedProps.length == 0);
      } else {
        this.assert(false);
      }
    }
  });

  Assertion.add('matchEach', function(other, description) {
    this.params = {operator: 'to match each ' + i(other), message: description};

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