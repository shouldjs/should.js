
export default function(should, Assertion) {
  var ARRAY_SLICE = Array.prototype.slice;

  function createProxyFunction(func) {
    var proxyFunc = function() {
      var args = ARRAY_SLICE.call(arguments);
      proxyFunc.calls.push({ args: args, context: this });
      return func.apply(this, args);
    };

    Object.defineProperties(proxyFunc, {
      called: {
        get: function() {
          return this.calls.length > 0;
        }
      },

      isSpy: {
        value: true,
        configurable: false
      },

      lastCall: {
        get: function() {
          if (this.called) {
            return this.calls[this.calls.length - 1];
          }
        }
      }
    });

    //proxyFunc.__func
    //proxyFunc.__obj
    //proxyFunc.__name

    proxyFunc.restore = function() {
      if (this.__obj && this.__name) {
        this.__obj[this.__name] = this.__func;
      }
    };

    proxyFunc.reset = function() {
      this.calls = [];
    };

    proxyFunc.reset();

    return proxyFunc;
  }

  function spy(func) {
    var proxy = createProxyFunction(func || function() {});
    Object.defineProperty(proxy, 'originalFunc', {
      value: func,
      enumerable: true,
      configurable: false
    });
    return proxy;
  }

  should.spy = spy;

  function proxy(obj, methodName) {
    var proxy = spy(obj[methodName]);
    Object.defineProperties(proxy, {
      __obj: {
        value: obj,
        enumerable: false,
        configurable: false
      },
      __name: {
        value: methodName,
        enumerable: false,
        configurable: false
      }
    });
    obj[methodName] = proxy;
    return proxy;
  }

  spy.proxy = proxy;

  function returns(something) {
    return spy(function() {
      return something;
    });
  }

  spy.returns = returns;


  Assertion.add('Spy', function() {
    this.props = { operator: 'is spy' };

    this.is.true(this.obj.isSpy);
  });


  Assertion.add('called', function() {
    this.props = { operator: 'to be called' };

    this.is.Spy();

    this.assert(this.obj.called);
  });

  Assertion.add('callCount', function(number) {
    this.props = { operator: 'to be called ' + should.format(number) + ' times' };

    this.is.Spy();

    this.have.property('calls').which.has.length(number);
  });

  Assertion.add('calledOn', function(obj) {
    this.props = { operator: 'to be called as method of ' + should.format(obj) };

    this.is.called();
    var lastCall = this.obj.lastCall;
    lastCall.obj.should.be.exactly(obj);
  });

  Assertion.add('calledWith', function() {
    this.props = { operator: 'to be called with ' + should.format(arguments) };

    this.is.called();

    var lastCall = this.obj.lastCall;
    lastCall.args.should.be.eql(ARRAY_SLICE.call(arguments));
  });


}
