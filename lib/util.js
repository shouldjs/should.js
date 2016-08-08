/*
 * should.js - assertion library
 * Copyright(c) 2010-2013 TJ Holowaychuk <tj@vision-media.ca>
 * Copyright(c) 2013-2016 Denis Bardadym <bardadymchik@gmail.com>
 * MIT Licensed
 */

import sformat from 'should-format';

var _hasOwnProperty = Object.prototype.hasOwnProperty;
var _propertyIsEnumerable = Object.prototype.propertyIsEnumerable;

export function hasOwnProperty(obj, key) {
  return _hasOwnProperty.call(obj, key);
}

export function propertyIsEnumerable(obj, key) {
  return _propertyIsEnumerable.call(obj, key);
}

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


export function convertPropertyName(name) {
  return (typeof name === 'symbol') ? name : String(name);
}

export function isIterator(obj) {
  if (!obj) {
    return false;
  }

  if (obj.__shouldIterator__) {// TODO maybe better to use @@iterator ?
    return true;
  }

  return typeof obj.next === 'function' &&
    typeof Symbol === 'function' &&
    typeof Symbol.iterator === 'symbol' &&
    typeof obj[Symbol.iterator] === 'function' &&
    obj[Symbol.iterator]() === obj;
}

//TODO find better way
export function isGeneratorFunction(f) {
  return typeof f === 'function' && /^function\s*\*\s*/.test(f.toString());
}

export var functionName = sformat.Formatter.functionName;
