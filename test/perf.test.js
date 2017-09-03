function mockComplexObject(prefix, depth, width) {
  if (depth <= 0) {
    return "value-" + prefix;
  }
  var obj = {};
  for (var i = 0; i < width; i++) {
    obj[prefix + depth + "_" + i] = mockComplexObject(prefix, depth - 1, width);
  }
  return obj;
}
var a = mockComplexObject("a", 8, 4);
var b = mockComplexObject("b", 8, 4);

it("should optimize not.equal for complex objects", function() {
  a.should.be.not.equal(b); // It takes a while
});
