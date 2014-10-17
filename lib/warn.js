var WARN = '\u001b[33mWARN\u001b[39m';

function generateDeprecated(lines) {
  return function(show) {
    if(!show) return;

    lines.forEach(function(line) {
      console.log(WARN, line);
    });
    console.log(WARN, 'To disable any warnings add should.warn = false');
  }
}

exports.staticShouldUnWrap = generateDeprecated([
  'Static version of should was called with primitive type wrapper like should(new Number(10))',
  'usually that is unexpected, but if it is not raise an issue at github',
  'current version will unwrap it to assert on primitive value for you',
  'but that will be changed in future versions, make sure you know what are you doing'
]);

exports.nonStrictEql = generateDeprecated([
  'Strict version of eql return different result for this comparison',
  'usually it is not right, but if it is ok raise an issue at github',
  'it means that e.g { a: 10 } is equal to { a: "10" }, make sure it is expected'
]);