/*!
 * Should
 * Copyright(c) 2010-2014 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */

/**
 * Check if given obj just a primitive type wrapper
 * @param {Object} obj
 * @returns {boolean}
 * @private
 */
exports.isWrapperType = function(obj) {
  return obj instanceof Number || obj instanceof String || obj instanceof Boolean;
};

/**
 * Merge object b with object a.
 *
 *     var a = { foo: 'bar' }
 *       , b = { bar: 'baz' };
 *
 *     utils.merge(a, b);
 *     // => { foo: 'bar', bar: 'baz' }
 *
 * @param {Object} a
 * @param {Object} b
 * @return {Object}
 * @private
 */

exports.merge = function(a, b) {
  if(a && b) {
    for(var key in b) {
      a[key] = b[key];
    }
  }
  return a;
};

function isArray(arr) {
  return isObject(arr) && (arr.__ArrayLike || Array.isArray(arr));
}

exports.isArray = isArray;

function isNumber(arg) {
  return typeof arg === 'number';
}

exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

exports.isString = isString;

function isBuffer(arg) {
  return typeof Buffer !== 'undefined' && arg instanceof Buffer;
}

exports.isBuffer = isBuffer;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}

exports.isDate = isDate;

function objectToString(o) {
  return Object.prototype.toString.call(o);
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

exports.isObject = isObject;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}

exports.isRegExp = isRegExp;

function isNullOrUndefined(arg) {
  return arg == null;
}

exports.isNullOrUndefined = isNullOrUndefined;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isArguments(object) {
  return objectToString(object) === '[object Arguments]';
}

exports.isArguments = isArguments;

exports.isFunction = function(arg) {
  return typeof arg === 'function' || arg instanceof Function;
};

function isError(e) {
  return (isObject(e) && objectToString(e) === '[object Error]') || (e instanceof Error);
}
exports.isError = isError;

function isUndefined(arg) {
  return arg === void 0;
}

exports.isUndefined = isUndefined;

var hasOwnProperty = Object.prototype.hasOwnProperty;

exports.forOwn = function(obj, f, context) {
  for(var prop in obj) {
    if(hasOwnProperty.call(obj, prop)) {
      f.call(context, obj[prop], prop);
    }
  }
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

exports.formatEqlResult = function(r, a, b, format) {
  return ((r.path.length > 0 ? 'at ' + r.path.map(exports.formatProp).join(' -> ') : '') +
          (r.a === a ? '' : ', A has ' + format(r.a)) +
          (r.b === b ? '' : ' and B has ' + format(r.b)) +
          (r.showReason ? ' because ' + r.reason: '')).trim();
};

exports.isEmptyObject = function(obj) {
  for(var prop in obj) {
    if(hasOwnProperty.call(obj, prop)) {
      return false;
    }
  }
  return true;
};