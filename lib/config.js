/*
 * should.js - assertion library
 * Copyright(c) 2010-2013 TJ Holowaychuk <tj@vision-media.ca>
 * Copyright(c) 2013-2016 Denis Bardadym <bardadymchik@gmail.com>
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
