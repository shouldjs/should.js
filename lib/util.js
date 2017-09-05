/*
 * should.js - assertion library
 * Copyright(c) 2010-2013 TJ Holowaychuk <tj@vision-media.ca>
 * Copyright(c) 2013-2017 Denis Bardadym <bardadymchik@gmail.com>
 * MIT Licensed
 */
import sformat from "should-format";

export function isWrapperType(obj) {
  return obj instanceof Number || obj instanceof String || obj instanceof Boolean;
}

// XXX make it more strict: numbers, strings, symbols - and nothing else
export function convertPropertyName(name) {
  return typeof name === "symbol" ? name : String(name);
}

export var functionName = sformat.functionName;

export function isPlainObject(obj) {
  if (typeof obj == "object" && obj !== null) {
    var proto = Object.getPrototypeOf(obj);
    return proto === Object.prototype || proto === null;
  }

  return false;
}
