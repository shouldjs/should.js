var err = require('../util').err,
	should = require('../../');

describe('error', function() {
  it('test throw()', function() {
    (function(){}).should.not.throw();
    (function(){ throw new Error('fail') }).should.throw();

    err(function(){
      (function(){}).should.throw();
    }, 'expected [Function] to throw exception');

    err(function(){
      (function(){
        throw new Error('fail');
      }).should.not.throw();
    }, 'expected [Function] not to throw exception (got [Error: fail])');
  });

  it('test throw() with regex message', function() {
    (function(){ throw new Error('fail'); }).should.throw(/fail/);

    err(function(){
      (function(){}).should.throw(/fail/);
    }, 'expected [Function] to throw exception');

    err(function(){
      (function(){ throw new Error('error'); }).should.throw(/fail/);
    }, "expected [Function] to throw exception with a message matching /fail/, but got 'error'");
  });

  it('test throw() with string message', function() {
    (function(){ throw new Error('fail'); }).should.throw('fail');

    err(function(){
      (function(){}).should.throw('fail');
    }, 'expected [Function] to throw exception');

    err(function(){
      (function(){ throw new Error('error'); }).should.throw('fail');
    }, "expected [Function] to throw exception with a message matching 'fail', but got 'error'");
  });

  it('test throw() with type', function() {
    (function(){ throw new Error('fail'); }).should.throw(Error);

    err(function(){
      (function(){}).should.throw(Error);
    }, 'expected [Function] to throw exception');

    err(function(){
      (function(){ throw 'error'; }).should.throw(Error);
    }, "expected [Function] to throw exception of type Error, but got String");
  });

  it('test throwError()', function() {
    (function(){}).should.not.throwError();
    (function(){ throw new Error('fail') }).should.throwError();

    err(function(){
      (function(){}).should.throwError();
    }, 'expected [Function] to throw exception');

    err(function(){
      (function(){
        throw new Error('fail');
      }).should.not.throwError();
    }, 'expected [Function] not to throw exception (got [Error: fail])');
  });

  it('test throwError() with regex message', function() {
    (function(){ throw new Error('fail'); }).should.throwError(/fail/);

    err(function(){
      (function(){}).should.throwError(/fail/);
    }, 'expected [Function] to throw exception');

    err(function(){
      (function(){ throw new Error('error'); }).should.throwError(/fail/);
    }, "expected [Function] to throw exception with a message matching /fail/, but got 'error'");
  });

  it('test throwError() with string message', function() {
    (function(){ throw new Error('fail'); }).should.throwError('fail');

    err(function(){
      (function(){}).should.throwError('fail');
    }, 'expected [Function] to throw exception');

    err(function(){
      (function(){ throw new Error('error'); }).should.throwError('fail');
    }, "expected [Function] to throw exception with a message matching 'fail', but got 'error'");
  });

  it('test throwError() with type', function() {
    (function(){ throw new Error('fail'); }).should.throw(Error);

    err(function(){
      (function(){}).should.throw(Error);
    }, 'expected [Function] to throw exception');

    err(function(){
      (function(){ throw 'error'; }).should.throw(Error);
    }, "expected [Function] to throw exception of type Error, but got String");
  });

  it('test .throw(err, properties) with matching error', function() {
    var error = new Error();
    error.a = 10;
    (function(){ throw error; }).should.throw(Error, { a: 10 });

    err(function(){
      (function(){ throw error; }).should.throw(Error, { a: 11 });
    }, "expected [Function] to throw exception: expected [Error] to match { a: 11 }\n\tnot matched properties: a(10)");
  });

  it('test .throw(properties) with matching error', function() {
    var error = new Error();
    error.a = 10;
    (function(){ throw error; }).should.throw({ a: 10 });

    err(function(){
      (function(){ throw error; }).should.throw({ a: 11 });
    }, "expected [Function] to throw exception: expected [Error] to match { a: 11 }\n\tnot matched properties: a(10)");
  });
});