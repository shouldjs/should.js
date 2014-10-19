var WARN = '\u001b[33mWARN\u001b[39m';

function generateDeprecated(lines) {
  return function(show) {
    if(!show) return;

    lines.concat(sharedPart).forEach(function(line) {
      console.warn(WARN, line);
    });
  }
}

var sharedPart = [
  'To disable any warnings add \u001b[33mshould.warn = false\u001b[39m',
  'If you think that is not right, raise issue on github https://github.com/shouldjs/should.js/issues'
];

exports.staticShouldUnWrap = generateDeprecated([
  'Static version of should was called with primitive type wrapper like should(new Number(10))',
  'current version will unwrap it to assert on primitive value for you',
  'but that will be changed in future versions, make sure you know what are you doing'
]);

exports.nonStrictEql = generateDeprecated([
  'Strict version of eql return different result for this comparison',
  'it means that e.g { a: 10 } is equal to { a: "10" }, make sure it is expected'
]);