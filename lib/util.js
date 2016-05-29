/*
 * should.js - assertion library
 * Copyright(c) 2010-2013 TJ Holowaychuk <tj@vision-media.ca>
 * Copyright(c) 2013-2016 Denis Bardadym <bardadymchik@gmail.com>
 * MIT Licensed
 */

import getType from 'should-type';
import sformat from 'should-format';
import config from './config';

/**
 * Check if given obj just a primitive type wrapper
 * @param {Object} obj
 * @returns {boolean}
 * @private
 */
export function isWrapperType(obj) {
  return obj instanceof Number ||
    obj instanceof String ||
    obj instanceof Boolean;
}

export function merge(a, b) {
  if (a && b) {
    for (var key in b) {
      a[key] = b[key];
    }
  }
  return a;
}

var hasOwnProperty = Object.prototype.hasOwnProperty;

export function forEach(obj, f, context) {
  if (isGeneratorFunction(obj)) {
    return forEach(obj(), f, context);
  } else if (isGeneratorObject(obj)) {
    var value = obj.next();
    while (!value.done) {
      if (f.call(context, value.value, 'value', obj) === false) {
        return;
      }
      value = obj.next();
    }
  } else {
    for (var prop in obj) {
      if (hasOwnProperty.call(obj, prop)) {
        if (f.call(context, obj[prop], prop, obj) === false) {
          return;
        }
      }
    }
  }
}

export function some(obj, f, context) {
  var res = false;
  forEach(obj, function(value, key) {
    if (f.call(context, value, key, obj)) {
      res = true;
      return false;
    }
  }, context);
  return res;
}

export function isEmptyObject(obj) {
  for (var prop in obj) {
    if (hasOwnProperty.call(obj, prop)) {
      return false;
    }
  }
  return true;
}

export function isIndexable(obj) {
  var t = getType(obj);
  return (t.type === 'object' && (
      t.cls === 'array' ||
      t.cls === 'buffer' ||
      t.cls === 'arguments' ||
      t.cls === 'array-buffer' || //TODO it could be wrong
      t.cls === 'typed-array' ||
      t.cls === 'data-view' || //TODO it could be wrong also
      t.cls === 'string'
    )) ||
    t.type === 'string';
}

export function length(obj) {
  var t = getType(obj);
  switch (t.type) {
    case 'string':
      return obj.length;
    case 'object':
      switch (t.cls) {
        case 'array-buffer':
        case 'typed-array':
        case 'data-view':
          return obj.byteLength;

        case 'array':
        case 'buffer':
        case 'arguments':
        case 'function':
          return obj.length;
      }
  }
}

export function convertPropertyName(name) {
  return (typeof name === 'symbol') ? name : String(name);
}

export function isGeneratorObject(obj) {
  if (!obj) {
    return false;
  }

  return typeof obj.next === 'function' &&
          typeof obj[Symbol.iterator] === 'function' &&
          obj[Symbol.iterator]() === obj;
}

//TODO find better way
export function isGeneratorFunction(f) {
  return typeof f === 'function' && /^function\s*\*\s*/.test(f.toString());
}

export function format(value, opts) {
  return config.getFormatter(opts).format(value);
}

export var functionName = sformat.Formatter.functionName;

export function formatProp(value) {
  return config.getFormatter().formatPropertyName(String(value));
}
