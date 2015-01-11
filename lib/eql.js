var config = require('./config');

var nodeEqual = require('./node-equal');
var shouldEqual = require('should-equal');

module.exports = function() {
  return config.useOldDeepEqual ? nodeEqual: shouldEqual;
};