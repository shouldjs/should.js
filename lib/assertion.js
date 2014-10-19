var AssertionError = require('./assertion-error');

function Assertion(obj, format) {
  this.obj = obj;
  this.format = format;
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
    var context = new Assertion(this.obj, this.format);
    context.anyOne = this.anyOne;

    try {
      f.apply(context, arguments);
    } catch(e) {
      //copy data from sub context to this
      this.params = context.params;

      //check for fail
      if(e instanceof AssertionError) {
        //negative fail
        if(this.negate) {
          this.obj = context.obj;
          this.negate = false;
          return this;
        }

        this.nestedErrorMessage = e.message;
        //positive fail
        this.fail();
      }
      // throw if it is another exception
      throw e;
    }
    //copy data from sub context to this
    this.params = context.params;

    //negative pass
    if(this.negate) {

      context.negate = true;
      this.nestedErrorMessage = context.params.message ? context.params.message : context.getMessage();
      this.fail();
    }

    this.obj = context.obj;
    this.negate = false;

    //positive pass
    return this;
  };

  Object.defineProperty(Assertion.prototype, name, prop);
};

Assertion.alias = function(from, to) {
  var desc = Object.getOwnPropertyDescriptor(Assertion.prototype, from);
  if(!desc) throw new Error('Alias ' + from + ' -> ' + to + ' could not be created as ' + from + ' not defined');
  Object.defineProperty(Assertion.prototype, to, desc);
};

var indent = '    ';
function prependIndent(line) {
  return indent + line;
}

function indentLines(text) {
  return text.split('\n').map(prependIndent).join('\n');
}

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

    if(this.nestedErrorMessage && msg != this.nestedErrorMessage) {
      msg = msg + '\n' +indentLines(this.nestedErrorMessage);
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

  fail: function() {
    return this.assert(false);
  },

  formattedObj: function() {
    return this.format(this.obj);
  },

  getMessage: function() {
    var actual = 'obj' in this.params ? this.params.obj : this.formattedObj();
    var expected = 'expected' in this.params ? ' ' + this.format(this.params.expected) : '';

    return 'expected ' + actual + (this.negate ? ' not ' : ' ') + this.params.operator + (expected);
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

module.exports = Assertion;