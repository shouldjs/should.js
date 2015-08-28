var err = require('../util').err,
  should = require('../../');

describe('eql', function() {
  it('test eql(val)', function() {
    'test'.should.eql('test');
    ({foo: 'bar'}).should.eql({foo: 'bar'});
    (1).should.eql(1);
    var memo = [];

    function memorize() {
      memo.push(arguments);
    }

    memorize('a', [1, 2]);
    memorize('a', [1, 2]);
    memo[0].should.eql(memo[1]);

    err(function() {
      (4).should.eql(3);
    }, 'expected 4 to equal 3');
  });

  it('test equal(val)', function() {
    'test'.should.equal('test');
    (1).should.equal(1);

    err(function() {
      (4).should.equal(3);
    }, 'expected 4 to be 3');

    err(function() {
      '4'.should.equal(4);
    }, "expected '4' to be 4");

    var date = new Date;
    date.should.equal(date);
  });

  it('test .equal()', function() {
    var foo;
    should.equal(undefined, foo);
  });

  it('should allow to test with prototypes', function() {
    var b = {a: 2};
    var a = Object.create(null);
    a.a = 2;

    b.should.be.eql(a);

    should.config.checkProtoEql = true;

    err(function() {
      b.should.be.eql(a);
    }, 'expected Object { a: 2 } to equal { a: 2 } (because A and B have different prototypes)');

    should.config.checkProtoEql = false;
  });

  it('should check one of equal', function() {
    'ab'.should.be.equalOneOf('a', 10, 'ab');
    'ab'.should.be.equalOneOf(['a', 10, 'ab']);
    'ab'.should.not.be.equalOneOf(['a', 10]);
    'ab'.should.not.be.equalOneOf('a', 10);
  });

  it('should check one of deep equal', function() {
    ({ a: 'ab' }).should.not.be.oneOf('a', 10, 'ab');
    ({ a: 'ab' }).should.not.be.oneOf(['a', 10, 'ab']);
    ({ a: 'ab' }).should.be.oneOf('a', 10, 'ab', { a: 'ab' });
    ({ a: 'ab' }).should.be.oneOf(['a', 10, 'ab', { a: 'ab' }]);
  });
});
