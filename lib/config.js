/*
 * should.js - assertion library
 * Copyright(c) 2010-2013 TJ Holowaychuk <tj@vision-media.ca>
 * Copyright(c) 2013-2017 Denis Bardadym <bardadymchik@gmail.com>
 * MIT Licensed
 */

import format from "should-format";
import { defaultTypeAdaptorStorage } from "should-type-adaptors";

var config = {
  typeAdaptors: defaultTypeAdaptorStorage,

  getFormatter: function(opts) {
    return new format.Formatter(opts || config);
  }
};

export default config;
