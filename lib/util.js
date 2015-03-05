/*!
 * Should
 * Copyright(c) 2010-2014 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */

var type = require('should-type');

/**
 * Check if given obj just a primitive type wrapper
 * @param {Object} obj
 * @returns {boolean}
 * @private
 */
exports.isWrapperType = function(obj) {
  return obj instanceof Number || obj instanceof String || obj instanceof Boolean;
};

exports.merge = function(a, b) {
  if(a && b) {
    for(var key in b) {
      a[key] = b[key];
    }
  }
  return a;
};

var hasOwnProperty = Object.prototype.hasOwnProperty;

exports.forEach = function forEach(obj, f, context) {
  if(exports.isGeneratorFunction(obj)) {
    return forEach(obj(), f, context);
  } else if (exports.isGeneratorObject(obj)) {
    var value = obj.next();
    while(!value.done) {
      if(f.call(context, value.value, 'value', obj) === false)
        return;
      value = obj.next();
    }
  } else {
    for(var prop in obj) {
      if(hasOwnProperty.call(obj, prop)) {
        if(f.call(context, obj[prop], prop, obj) === false)
          return;
      }
    }
  }
};

exports.some = function(obj, f, context) {
  var res = false;
  exports.forEach(obj, function(value, key) {
    if(f.call(context, value, key, obj)) {
      res = true;
      return false;
    }
  }, context);
  return res;
};

var functionNameRE = /^\s*function\s*(\S*)\s*\(/;

exports.functionName = function(f) {
  if(f.name) {
    return f.name;
  }
  var name = f.toString().match(functionNameRE)[1];
  return name;
};

var formatPropertyName = require('should-format').formatPropertyName;

exports.formatProp = function(value) {
  return formatPropertyName(String(value));
};


exports.isEmptyObject = function(obj) {
  for(var prop in obj) {
    if(hasOwnProperty.call(obj, prop)) {
      return false;
    }
  }
  return true;
};

exports.isIndexable = function(obj) {
  var t = type(obj);
  return t == type.ARRAY ||
    t == type.BUFFER ||
    t == type.ARGUMENTS ||
    t == type.ARRAY_BUFFER ||
    t == type.TYPED_ARRAY ||
    t == type.DATA_VIEW ||
    t == type.STRING;
};

exports.length = function(obj) {
  switch(type(obj)) {
    case type.ARRAY_BUFFER:
    case type.TYPED_ARRAY:
    case type.DATA_VIEW:
      return obj.byteLength;

    case type.ARRAY:
    case type.BUFFER:
    case type.ARGUMENTS:
    case type.FUNCTION:
    case type.STRING:
      return obj.length;
  }
};

exports.convertPropertyName = function(name) {
  if(typeof name == 'symbol') {
    return name;
  } else {
    return String(name);
  }
};

exports.isGeneratorObject = function(obj) {
  if(!obj) return false;

  return typeof obj.next == 'function' &&
          typeof obj[Symbol.iterator] == 'function' &&
          obj[Symbol.iterator]() === obj;
};

//TODO find better way
exports.isGeneratorFunction = function(f) {
  if(typeof f != 'function') return false;

  return /^function\s*\*\s*/.test(f.toString());
}