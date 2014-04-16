var should = require('../');

function err(fn, msg) {
  var ok = true;
  try {
    fn();
    ok = false;
  } catch (err) {
    if(err.message !== msg)
      throw new should.AssertionError({ message: 'Expected message does not match', expected: msg, actual: err.message });
  }
  if(!ok) throw new Error('expected an error');
}

exports.err = err;