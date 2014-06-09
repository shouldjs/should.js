var err = require('../util').err;
var should = require('../../');

describe('property', function() {

  it('test containEql', function() {
    'hello boy'.should.containEql('boy');
    [1, 2, 3].should.containEql(3);
    [
      [1],
      [2],
      [3]
    ].should.containEql([3]);
    [
      [1],
      [2],
      [3, 4]
    ].should.not.containEql([3]);
    [
      {a: 'a'},
      {b: 'b', c: 'c'}
    ].should.containEql({a: 'a'});
    [
      {a: 'a'},
      {b: 'b', c: 'c'}
    ].should.not.containEql({b: 'b'});

    ({}).should.not.containEql({ a: 10 });

    ({ b: 10 }).should.containEql({ b: 10 });
    [1, 2, 3].should.containEql(1);
    ([1, 2, { a: 10 }]).should.containEql({ a: 10 });
    [1, 2, 3].should.not.containEql({ a: 1 });

    err(function() {
      [1, 2, 3].should.not.containEql(3);
    }, "expected [ 1, 2, 3 ] not to contain 3");

    err(function() {
      [1, 2, 3].should.containEql(4);
    }, "expected [ 1, 2, 3 ] to contain 4");
  });

  it('test containDeep', function() {
    'hello boy'.should.containDeep('boy');

    ({ a: { b: 10 }, b: { c: 10, d: 11, a: { b: 10, c: 11} }}).should
      .containDeep({ a: { b: 10 }, b: { c: 10, a: { c: 11 }}});

    [1, 2, 3, { a: { b: { d: 12 }}}].should.containDeep([
      { a: { b: {d: 12}}}
    ]);

    [
      [1, [2, 3], 3],
      [2]
    ].should.not.containDeep([1, 2]);

    [
      [1],
      [2],
      [3]
    ].should.containDeep([
        [3]
      ]);
    [
      [1],
      [2],
      [3, 4]
    ].should.containDeep([
        [3]
      ]);
    [
      [1],
      [2],
      [3, 4]
    ].should.containDeep([
        [1],
        [3]
      ]);
    [
      [1],
      [2],
      [3, 4]
    ].should.containDeep([
        [3],
        [1]
      ]);

    [1,2,3].should.not.containDeep([3,3,3]);
    [1,2,3].should.containDeep([3]);

    [
      {a: 'a'},
      {b: 'b', c: 'c'}
    ].should.containDeep([
        {a: 'a'}
      ]);

    [
      {a: 'a'},
      {b: 'b', c: 'c'}
    ].should.containDeep([
        {b: 'b'}
      ]);

    [1, 2, 3].should.containDeep([3, 2]);

    err(function() {
      'hello boy'.should.not.containDeep('boy');
    }, "expected 'hello boy' not to contain 'boy'");

    err(function() {
      [
        {a: 'a'},
        {b: 'b', c: 'c'}
      ].should.not.containDeep([
          {b: 'b'}
        ]);
    }, "expected [ { a: 'a' }, { b: 'b', c: 'c' } ] not to contain [ { b: 'b' } ]");
  });

  it('test .containDeepOrdered', function() {
    'hello boy'.should.containDeepOrdered('boy');

    ({ a: { b: 10 }, b: { c: 10, d: 11, a: { b: 10, c: 11} }}).should
      .containDeepOrdered({ a: { b: 10 }, b: { c: 10, a: { c: 11 }}});

    [1, 2, 3, { a: { b: { d: 12 }}}].should.containDeepOrdered([
      { a: { b: {d: 12}}}
    ]);

    [
      [1, [2, 3], 3],
      [2]
    ].should.not.containDeepOrdered([1, 2]);

    [
      [1],
      [2],
      [3]
    ].should.containDeepOrdered([
        [3]
      ]);
    [
      [1],
      [2],
      [3, 4]
    ].should.containDeepOrdered([
        [3]
      ]);
    [
      [1],
      [2],
      [3, 4]
    ].should.containDeepOrdered([
        [1],
        [3]
      ]);
    [
      [1],
      [2],
      [3, 4]
    ].should.not.containDeepOrdered([
        [3],
        [1]
      ]);
    [
      {a: 'a'},
      {b: 'b', c: 'c'}
    ].should.containDeepOrdered([
        {a: 'a'}
      ]);
    [
      {a: 'a'},
      {b: 'b', c: 'c'}
    ].should.containDeepOrdered([
        {b: 'b'}
      ]);

    err(function() {
      'hello boy'.should.not.containDeepOrdered('boy');
    }, "expected 'hello boy' not to contain 'boy'");

    err(function() {
      [
        {a: 'a'},
        {b: 'b', c: 'c'}
      ].should.not.containDeepOrdered([
          {b: 'b'}
        ]);
    }, "expected [ { a: 'a' }, { b: 'b', c: 'c' } ] not to contain [ { b: 'b' } ]");
  });
});
