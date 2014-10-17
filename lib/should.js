/*!
 * Should
 * Copyright(c) 2010-2014 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */


var util = require('./util'),
  AssertionError = util.AssertionError,
  inspect = util.inspect;

/**
 * Our function should
 * @param obj
 * @returns {Assertion}
 */
var should = function should(obj) {
  return new Assertion(util.isWrapperType(obj) ? obj.valueOf() : obj);
};

should.warn = true;

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

should.AssertionError = AssertionError;

should.format = function(value) {
  return inspect(value, {depth: null});
};

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
  var prop = {enumerable: true};
  prop[isGetter ? 'get' : 'value'] = function() {
    var context = this.nested = new Assertion(this.obj);
    context.copy = context.copyIfMissing;
    context.anyOne = this.anyOne;

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
  var desc = Object.getOwnPropertyDescriptor(Assertion.prototype, from);
  if(!desc) throw new Error('Alias ' + from + ' -> ' + to + ' could not be created as ' + from + ' not defined');
  Object.defineProperty(Assertion.prototype, to, desc);
};

Assertion.prototype = {
  constructor: Assertion,

  assert: function(expr) {
    if(expr) return this;

    var params = this.params;

    var msg = params.message, generatedMessage = false;
    if(!msg) {
      msg = this.getMessage();
      generatedMessage = true;
    }

    var err = new AssertionError({
      message: msg,
      actual: this.obj,
      expected: params.expected,
      stackStartFunction: this.assert
    });

    err.showDiff = params.showDiff;
    err.operator = params.operator;
    err.generatedMessage = generatedMessage;

    throw err;
  },

  getMessage: function() {
    var actual = 'obj' in this.params ? this.params.obj : should.format(this.obj);
    var expected = 'expected' in this.params ? ' ' + should.format(this.params.expected) : '';

    return 'expected ' + actual + (this.negate ? ' not ' : ' ') + this.params.operator + (expected);
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
    this.anyOne = true;
    return this;
  }
};

should.use = function(f) {
  f(this, Assertion);
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
