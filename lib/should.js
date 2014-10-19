/*!
 * Should
 * Copyright(c) 2010-2014 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */


var util = require('./util');
var inspect = require('./inspect').inspect;
var warn = require('./warn');

/**
 * Our function should
 * @param obj
 * @returns {should.Assertion}
 */
var should = function should(obj) {
  warn.staticShouldUnWrap(util.isWrapperType(obj) && should.warn);

  var unwrappedObj = util.isWrapperType(obj) ? obj.valueOf() : obj;
  return new should.Assertion(unwrappedObj, should.format);
};

var envVarName = 'SHOULDJS_WARN';
var envVarResult = typeof process !== 'undefined' && process.env[envVarName] && process.env[envVarName] === 'true';
should.warn = typeof envVarResult == 'undefined' ? true: envVarResult;

should.AssertionError = require('./assertion-error');
should.Assertion = require('./assertion');

should.format = function(value) {
  return inspect(value, {depth: null});
};

/**
 * Expose should to external world.
 */
exports = module.exports = should;

should.extend = function(propertyName, proto) {
  propertyName = propertyName || 'should';
  proto = proto || Object.prototype;

  Object.defineProperty(proto, propertyName, {
    set: function() {
    },
    get: function() {
      return should(util.isWrapperType(this) ? this.valueOf() : this);
    },
    configurable: true
  });
};

/**
 * Expose api via `Object#should`.
 *
 * @api public
 */
should.extend('should', Object.prototype);

should.use = function(f) {
  f(this, this.Assertion);
  return this;
};

should
  .use(require('./ext/assert'))
  .use(require('./ext/chain'))
  .use(require('./ext/bool'))
  .use(require('./ext/number'))
  .use(require('./ext/eql'))
  .use(require('./ext/type'))
  .use(require('./ext/string'))
  .use(require('./ext/property'))
  .use(require('./ext/error'))
  .use(require('./ext/match'))
  .use(require('./ext/contain'));
