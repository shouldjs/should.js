var util = require('./util');

/**
 * should AssertionError
 * @param {Object} options
 * @constructor
 * @memberOf should
 * @static
 */
var AssertionError = function AssertionError(options) {
  this.name = 'AssertionError';
  this.actual = options.actual;
  this.expected = options.expected;
  this.operator = options.operator;

  this.message = options.message;

  var stackStartFunction = options.stackStartFunction;

  if(Error.captureStackTrace) {
    Error.captureStackTrace(this, stackStartFunction);
  }
  else {
    // non v8 browsers so we can have a stacktrace
    var err = new Error();
    if(err.stack) {
      var out = err.stack;

      if(stackStartFunction) {
        // try to strip useless frames
        var fn_name = util.functionName(stackStartFunction);
        var idx = out.indexOf('\n' + fn_name);
        if(idx >= 0) {
          // once we have located the function frame
          // we need to strip out everything before it (and its line)
          var next_line = out.indexOf('\n', idx + 1);
          out = out.substring(next_line + 1);
        }
      }

      this.stack = out;
    }
  }
};

// assert.AssertionError instanceof Error
AssertionError.prototype = Object.create(Error.prototype);

module.exports = AssertionError;