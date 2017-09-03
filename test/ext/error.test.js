var err = require("../util").err;

describe("error", function() {
  it("test throw()", function() {
    err(function() {
      "a".should.throw();
    }, "expected 'a' to be a function\n    expected 'a' to have type function\n        expected 'string' to be 'function'");

    (function() {}.should.not.throw());
    (function() {
      throw new Error("fail");
    }.should.throw());

    err(function() {
      (function() {}.should.throw());
    }, "expected Function { name: '' } to throw exception");

    err(function() {
      (function() {
        throw new Error("fail");
      }.should.not.throw());
    }, /expected Function \{ name: '' \} not to throw exception \(got Error \{[\s\S]*message: 'fail'[\s\S]*\}\)/);
  });

  it("test throw() with regex message", function() {
    (function() {
      throw new Error("fail");
    }.should.throw(/fail/));

    err(function() {
      (function() {}.should.throw(/fail/));
    }, "expected Function { name: '' } to throw exception");

    err(function() {
      (function() {
        throw new Error("error");
      }.should.throw(/fail/));
    }, "expected Function { name: '' } to throw exception with a message matching /fail/, but got 'error'");
  });

  it("test throw() with string message", function() {
    (function() {
      throw new Error("fail");
    }.should.throw("fail"));

    err(function() {
      (function() {}.should.throw("fail"));
    }, "expected Function { name: '' } to throw exception");

    err(function() {
      (function() {
        throw new Error("error");
      }.should.throw("fail"));
    }, "expected Function { name: '' } to throw exception with a message matching 'fail', but got 'error'");
  });

  it("test throw() with type", function() {
    (function() {
      throw new Error("fail");
    }.should.throw(Error));

    err(function() {
      (function() {}.should.throw(Error));
    }, "expected Function { name: '' } to throw exception");

    err(function() {
      (function() {
        throw "error";
      }.should.throw(Error));
    }, "expected Function { name: '' } to throw exception of type Error, but got String");
  });

  it("test throwError()", function() {
    (function() {}.should.not.throwError());
    (function() {
      throw new Error("fail");
    }.should.throwError());

    err(function() {
      (function() {}.should.throwError());
    }, "expected Function { name: '' } to throw exception");

    err(function() {
      (function() {
        throw new Error("fail");
      }.should.not.throwError());
    }, /expected Function \{ name: '' \} not to throw exception \(got Error \{[\s\S]*message: 'fail'[\s\S]*\}\)/);
  });

  it("test throwError() with regex message", function() {
    (function() {
      throw new Error("fail");
    }.should.throwError(/fail/));

    err(function() {
      (function() {}.should.throwError(/fail/));
    }, "expected Function { name: '' } to throw exception");

    err(function() {
      (function() {
        throw new Error("error");
      }.should.throwError(/fail/));
    }, "expected Function { name: '' } to throw exception with a message matching /fail/, but got 'error'");
  });

  it("test throwError() with string message", function() {
    (function() {
      throw new Error("fail");
    }.should.throwError("fail"));

    err(function() {
      (function() {}.should.throwError("fail"));
    }, "expected Function { name: '' } to throw exception");

    err(function() {
      (function() {
        throw new Error("error");
      }.should.throwError("fail"));
    }, "expected Function { name: '' } to throw exception with a message matching 'fail', but got 'error'");
  });

  it("test throwError() with type", function() {
    (function() {
      throw new Error("fail");
    }.should.throw(Error));

    err(function() {
      (function() {}.should.throw(Error));
    }, "expected Function { name: '' } to throw exception");

    err(function() {
      (function() {
        throw "error";
      }.should.throw(Error));
    }, "expected Function { name: '' } to throw exception of type Error, but got String");
  });

  it("test .throw(err, properties) with matching error", function() {
    var error = new Error();
    error.a = 10;
    (function() {
      throw error;
    }.should.throw(Error, { a: 10 }));

    err(function() {
      (function() {
        throw error;
      }.should.throw(Error, { a: 11 }));
    }, /expected Function \{ name: '' \} to throw exception: expected Error \{[\s\S]*a: 10,[\s\S]*message: ''[\s\S]*\} to match Object \{ a: 11 \}\n\s{4}not matched properties: a \(10\)/);
  });

  it("test .throw(properties) with matching error", function() {
    var error = new Error();
    error.a = 10;
    (function() {
      throw error;
    }.should.throw({ a: 10 }));

    err(function() {
      (function() {
        throw error;
      }.should.throw({ a: 11 }));
    }, /expected Function \{ name: '' \} to throw exception: expected Error \{[\s\S]*a: 10,[\s\S]*message: ''[\s\S]*\} to match Object \{ a: 11 \}\n\s{4}not matched properties: a \(10\)/);
  });
  /* TODO find a way to write tests with es6 features
  it('should support to catch errors from generators', function() {
    if(generatorSupported) {
      var throwsError = function*() {
        throw new Error();
      }

      (function * () {
        yield throwsError();
      }).should.throw();

      var throwsError1 = function*() {
        throw new Error();
        yield console.log('hello');
      }

      (function * () {
        yield throwsError1();
      }).should.throw();

      var noError = function * () { yield console.log('no error') };

      err(function(){
        (function * () {yield noError();}).should.throw();
      }, 'expected Function { name: \'\' } to throw exception');

    }
  });*/
});
