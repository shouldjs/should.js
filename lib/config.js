/*
 * Should
 * Copyright(c) 2010-2015 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */

var Formatter = require('should-format').Formatter;

var config = {
  checkProtoEql: false,

  getFormatter: function(opts) {
    return new Formatter(opts || config);
  }
};

module.exports = config;
