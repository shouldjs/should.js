var err = require('../util').err;
var should = require('../../');

describe('property', function() {
  it('test enumerable(name)', function() {
    ({'length': 5}).should.have.enumerable('length');
    (4).should.not.have.enumerable('length');

    err(function() {
      'asd'.should.have.enumerable('length');
    }, "expected 'asd' to have enumerable property length");
  });

  it('test enumerable(name, val)', function() {
    ({'length': 5}).should.have.enumerable('length', 5);

    err(function() {
      ({'length': 3}).should.have.enumerable('length', 5);
    }, "expected { length: 3 } to have enumerable property length equal to 5");
  });

  it('test property(name)', function() {
    'test'.should.have.property('length');
    (4).should.not.have.property('length');

    err(function() {
      'asd'.should.have.property('foo');
    }, "expected 'asd' to have property foo");
  });

  it('test property(name, val)', function() {
    'test'.should.have.property('length', 4);
    'asd'.should.have.property('constructor', String);

    err(function() {
      'asd'.should.have.property('length', 4);
    }, "expected 'asd' to have property length of 4 (got 3)");

    err(function() {
      'asd'.should.not.have.property('length', 3);
    }, "expected 'asd' not to have property length of 3");

    err(function() {
      var obj = { f: function() {} };
      var f1 = function() {};
      obj.should.have.property('f', f1);
    }, "expected { f: [Function] } to have property f of [Function] (got [Function])");

    err(function() {
      ({a: {b: 1}}).should.have.property('a')
        .and.have.property('b', 100);
    }, "expected { b: 1 } to have property b of 100 (got 1)");

    err(function() {
      ({a: {b: 1}}).should.have.property('a')
        .and.have.property('c', 100);
    }, "expected { b: 1 } to have property c");

    err(function() {
      ({a: {b: 1}}).should.have.property('a')
        .and.have.property('c');
    }, "expected { b: 1 } to have property c");

  });

  it('test length(n)', function() {
    'test'.should.have.length(4);
    'test'.should.have.lengthOf(4);
    'test'.should.not.have.length(3);
    [1, 2, 3].should.have.length(3);
    ({ length: 10}).should.have.length(10);

    err(function() {
      (4).should.have.length(3);
    }, "expected 4 to have property length");

    err(function() {
      'asd'.should.not.have.length(3);
    }, "expected 'asd' not to have property length of 3");

  });

  it('test ownProperty(name)', function() {
    'test'.should.have.ownProperty('length');
    ({ length: 12 }).should.have.ownProperty('length');

    err(function() {
      ({ length: 12 }).should.not.have.ownProperty('length');
    }, "expected { length: 12 } not to have own property length");

    err(function() {
      ({ length: 12 }).should.not.have.ownProperty('length', 'foo');
    }, "foo");

    err(function() {
      ({ length: 12 }).should.have.ownProperty('foo', 'foo');
    }, "foo");
  });

  it('test ownProperty(name).equal(val)', function() {
    ({length: 10}).should.have.ownProperty('length').equal(10);
  });

  it('test properties(name1, name2, ...)', function() {
    'test'.should.have.properties('length', 'indexOf');
    (4).should.not.have.properties('length');

    err(function() {
      'asd'.should.have.properties('foo');
    }, "expected 'asd' to have property foo");

    err(function() {
      'asd'.should.not.have.properties('length', 'indexOf');
    }, "expected 'asd' not to have properties length, indexOf");
  });

  it('test properties([names])', function() {
    'test'.should.have.properties(['length', 'indexOf']);
    (4).should.not.have.properties(['length']);

    err(function() {
      'asd'.should.have.properties(['foo']);
    }, "expected 'asd' to have property foo");
  });

  it('test any of properties', function() {
    'test'.should.have.any.of.properties('length', 'a', 'b');

    'test'.should.have.any.of.properties('length');

    ({ a: 10 }).should.have.any.of.properties('a', 'b');

    ({ a: 10 }).should.have.any.of.properties({ a: 10, b: 12 });

    ({ a: 10 }).should.not.have.any.of.properties('b', 'c');

    ({ a: 10 }).should.have.any.of.properties(['a', 'b']);

    err(function() {
      ({ a: 10 }).should.not.have.any.of.properties(['a', 'b']);
    }, "expected { a: 10 } not to have property a");

    err(function() {
      ({ a: 10, b: 10 }).should.not.have.any.of.properties(['a', 'b']);
    }, "expected { a: 10, b: 10 } not to have any of properties a, b");

    err(function() {
      ({ a: 10, b: 10 }).should.not.have.any.of.properties({ a: 10, b: 12 });
    }, "expected { a: 10, b: 10 } not to have property a of 10");

    err(function() {
      ({ a: 10, b: 10 }).should.not.have.any.of.properties({ a: 10, b: 10 });
    }, "expected { a: 10, b: 10 } not to have any of properties a of 10, b of 10");

    err(function() {
      ({ a: 11, b: 11 }).should.have.any.of.properties({ a: 10, b: 10 });
    }, "expected { a: 11, b: 11 } to have any of properties a of 10 (got 11), b of 10 (got 11)");
  });

  it('test keys(array)', function() {
    ({ foo: 1 }).should.have.keys(['foo']);
    ({ foo: 1, bar: 2 }).should.have.keys(['foo', 'bar']);
    ({ foo: 1, bar: 2 }).should.have.keys('foo', 'bar');
    ({}).should.have.keys();
    ({}).should.have.keys([]);

    ({ '1': 'cancelled', '3': 'deleted' }).should.have.keys(1, 3);

    err(function() {
      ({ foo: 1 }).should.have.keys(['bar']);
    }, "expected { foo: 1 } to have key bar\n\tmissing keys: bar\n\textra keys: foo");

    err(function() {
      ({ foo: 1 }).should.have.keys(['bar', 'baz']);
    }, "expected { foo: 1 } to have keys bar, baz\n\tmissing keys: bar, baz\n\textra keys: foo");

    err(function() {
      ({ foo: 1 }).should.not.have.keys('foo');
    }, "expected { foo: 1 } not to have key foo");

    err(function() {
      ({ foo: 1 }).should.not.have.keys(['foo']);
    }, "expected { foo: 1 } not to have key foo");

    err(function() {
      ({ foo: 1, bar: 2 }).should.not.have.keys(['foo', 'bar']);
    }, "expected { bar: 2, foo: 1 } not to have keys foo, bar");
  });

  it('test empty', function() {
    ''.should.be.empty;
    [].should.be.empty;
    ({}).should.be.empty;
    ({ length: 10 }).should.not.be.empty;

    (function() {
      arguments.should.be.empty;
    })();

    err(function() {
      ({}).should.not.be.empty;
    }, 'expected {} not to be empty');

    err(function() {
      ({ length: 10 }).should.be.empty;
    }, 'expected { length: 10 } to be empty\n    expected { length: 10 } not to have own property length');

    err(function() {
      'asd'.should.be.empty;
    }, "expected 'asd' to be empty\n    expected 'asd' to have property length of 0 (got 3)");

    err(function() {
      ''.should.not.be.empty;
    }, "expected '' not to be empty");
  });


  it('should .propertyByPath lookup properties by name path', function() {
    ({ a: { b: 10}}).should.have.propertyByPath('a', 'b');

    ({ '0': { '0': 10}}).should.not.have.propertyByPath(0, 0, 1);

    // true fail
    err(function() {
      ({ a: { b: 10}}).should.have.propertyByPath('a', 'b', 'c');
    }, "expected { a: { b: 10 } } to have property by path a, b, c - failed on c\n    expected 10 to have property c");

    // false positive
    err(function() {
      ({ a: { b: 10}}).should.not.have.propertyByPath('a', 'b');
    }, "expected { a: { b: 10 } } not to have property by path a, b");
  })
});
