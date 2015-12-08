window.Should = require('./index');

Object.defineProperty(window, 'should', {
  enumerable: false,
  configurable: true,
  value: window.Should
});
