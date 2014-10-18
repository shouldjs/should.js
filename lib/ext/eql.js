/*!
 * Should
 * Copyright(c) 2010-2014 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */

var eql = require('../eql');
var strictEql = require('should-equal');
var warn = require('../warn');

module.exports = function(should, Assertion) {
  Assertion.add('eql', function(val, description) {
    this.params = { operator: 'to equal', expected: val, showDiff: true, message: description };

    var nonStrictResult = eql(val, this.obj);

    warn.nonStrictEql(should.warn && nonStrictResult !== strictEql(val, this.obj));

    this.assert(nonStrictResult);
  });

  Assertion.add('equal', function(val, description) {
    this.params = { operator: 'to be', expected: val, showDiff: true, message: description };

    this.assert(val === this.obj);
  });

  /*
  Assertion.add('strictEql', function(val, description) {
    this.params = { operator: 'to equal', expected: val, showDiff: true, message: description };

    this.assert(strictEql(val, this.obj));
  });
  */

  Assertion.alias('equal', 'exactly');
};