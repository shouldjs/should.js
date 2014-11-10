/*!
 * Should
 * Copyright(c) 2010-2014 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */

var eql = require('should-equal');
var warn = require('../warn');

var util = require('../util');

module.exports = function(should, Assertion) {
  Assertion.add('eql', function(val, description) {
    this.params = {operator: 'to equal', expected: val, showDiff: true, message: description};

    var strictResult = eql(this.obj, val);

    if(!strictResult.result) {
      this.params.details = util.formatEqlResult(strictResult, this.obj, val, should.format);
    }

    this.assert(strictResult.result);
  });

  Assertion.add('equal', function(val, description) {
    this.params = {operator: 'to be', expected: val, showDiff: true, message: description};

    this.assert(val === this.obj);
  });

  Assertion.alias('equal', 'exactly');
};