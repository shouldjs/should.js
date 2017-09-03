function err(fn, msg) {
  if (arguments.length > 2) {
    msg = Array.prototype.slice.call(arguments, 1).join("\n");
  }

  var ok = true;
  try {
    fn();
    ok = false;
  } catch (err) {
    if (
      (typeof msg == "string" && err.message !== msg) ||
      (msg instanceof RegExp && !msg.test(err.message))
    ) {
      throw new should.AssertionError({
        message: [
          "Expected message does not match",
          "expected: " + should.format(msg),
          "  actual: " + should.format(err.message)
        ].join("\n"),
        expected: msg,
        actual: err.message,
        stackStartFunction: err
      });
    }
  }
  if (!ok) throw new Error("expected an error");
}

exports.err = err;
