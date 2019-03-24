/*
 * should.js - assertion library
 * Copyright(c) 2010-2013 TJ Holowaychuk <tj@vision-media.ca>
 * Copyright(c) 2013-2017 Denis Bardadym <bardadymchik@gmail.com>
 * MIT Licensed
 */

export default function(should, Assertion) {
  /**
   * Assert given object is exactly `true`.
   *
   * @name true
   * @memberOf Assertion
   * @category assertion bool
   * @alias Assertion#True
   * @param {string} [message] Optional message
   * @example
   *
   * (true).should.be.true();
   * false.should.not.be.true();
   *
   * ({ a: 10}).should.not.be.true();
   */
  Assertion.add("true", function(message) {
    this.is.exactly(true, message);
  });

  Assertion.alias("true", "True");

  /**
   * Assert given object is exactly `false`.
   *
   * @name false
   * @memberOf Assertion
   * @category assertion bool
   * @alias Assertion#False
   * @param {string} [message] Optional message
   * @example
   *
   * (true).should.not.be.false();
   * false.should.be.false();
   */
  Assertion.add("false", function(message) {
    this.is.exactly(false, message);
  });

  Assertion.alias("false", "False");

  /**
   * Assert given object is truthy according javascript type conversions.
   *
   * @name ok
   * @memberOf Assertion
   * @category assertion bool
   * @example
   *
   * (true).should.be.ok();
   * ''.should.not.be.ok();
   * should(null).not.be.ok();
   * should(void 0).not.be.ok();
   *
   * (10).should.be.ok();
   * (0).should.not.be.ok();
   */
  Assertion.add("ok", function() {
    this.assertZeroArguments(arguments);
    this.params = { operator: "to be truthy" };

    this.assert(this.obj);
  });

  /**
   * Assert given object is truthy according javascript type conversions.
   *
   * @name truthy
   * @memberOf Assertion
   * @category assertion bool
   * @example
   *
   * (true).should.be.truthy();
   * ''.should.not.be.truthy();
   * should(null).not.be.truthy();
   * should(void 0).not.be.truthy();
   *
   * (10).should.be.truthy();
   * (0).should.not.be.truthy();
   */
  Assertion.alias("ok", "truthy");


  /**
   * Assert given object is falsy according javascript type conversions.
   *
   * @name falsy
   * @memberOf Assertion
   * @category assertion bool
   * @example
   *
   * (false).should.be.falsy();
   * ''.should.be.falsy();
   * should(null).be.falsy();
   * should(void 0).be.falsy();
   *
   * (10).should.not.be.falsy();
   * (0).should.be.falsy();
   */
  Assertion.add('falsy', function() {
    this.assertZeroArguments(arguments);
    this.params = { operator: 'to be falsy' };
    this.assert(!this.obj);
  });
}
