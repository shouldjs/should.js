import should from "./index";

if (typeof define === "function" && define.amd) {
  define([], function() {
    return should;
  });
} else if (typeof module === "object" && module.exports) {
  module.exports = should;
}
