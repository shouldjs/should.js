/*
 * should.js - assertion library
 * Copyright(c) 2010-2013 TJ Holowaychuk <tj@vision-media.ca>
 * Copyright(c) 2013-2017 Denis Bardadym <bardadymchik@gmail.com>
 * MIT Licensed
 */

import { convertPropertyName } from "../util";
import { hasOwnProperty } from "should-util";
import { formatProp } from "../format";
import { isEmpty, has as hasKey, get as getValue, size } from "should-type-adaptors";
import eql from "should-equal";

var aSlice = Array.prototype.slice;

export default function(should, Assertion) {
  var i = should.format;
  /**
   * Asserts given object has some descriptor. **On success it change given object to be value of property**.
   *
   * @name propertyWithDescriptor
   * @memberOf Assertion
   * @category assertion property
   * @param {string} name Name of property
   * @param {Object} desc Descriptor like used in Object.defineProperty (not required to add all properties)
   * @example
   *
   * ({ a: 10 }).should.have.propertyWithDescriptor('a', { enumerable: true });
   */
  Assertion.add("propertyWithDescriptor", function(name, desc) {
    this.params = {
      actual: this.obj,
      operator: "to have own property with descriptor " + i(desc)
    };
    var obj = this.obj;
    this.have.ownProperty(name);
    should(Object.getOwnPropertyDescriptor(Object(obj), name)).have.properties(desc);
  });

  /**
   * Asserts given object has property with optionally value. **On success it change given object to be value of property**.
   *
   * @name property
   * @memberOf Assertion
   * @category assertion property
   * @param {string} name Name of property
   * @param {*} [val] Optional property value to check
   * @example
   *
   * ({ a: 10 }).should.have.property('a');
   */
  Assertion.add("property", function(name, val) {
    name = convertPropertyName(name);
    if (arguments.length > 1) {
      var p = {};
      p[name] = val;
      this.have.properties(p);
    } else {
      this.have.properties(name);
    }
    this.obj = this.obj[name];
  });

  /**
   * Asserts given object has properties. On this method affect .any modifier, which allow to check not all properties.
   *
   * @name properties
   * @memberOf Assertion
   * @category assertion property
   * @param {Array|...string|Object} names Names of property
   * @example
   *
   * ({ a: 10 }).should.have.properties('a');
   * ({ a: 10, b: 20 }).should.have.properties([ 'a' ]);
   * ({ a: 10, b: 20 }).should.have.properties({ b: 20 });
   */
  Assertion.add("properties", function(names) {
    var values = {};
    if (arguments.length > 1) {
      names = aSlice.call(arguments);
    } else if (!Array.isArray(names)) {
      if (typeof names == "string" || typeof names == "symbol") {
        names = [names];
      } else {
        values = names;
        names = Object.keys(names);
      }
    }

    var obj = Object(this.obj),
      missingProperties = [];

    //just enumerate properties and check if they all present
    names.forEach(function(name) {
      if (!(name in obj)) {
        missingProperties.push(formatProp(name));
      }
    });

    var props = missingProperties;
    if (props.length === 0) {
      props = names.map(formatProp);
    } else if (this.anyOne) {
      props = names
        .filter(function(name) {
          return missingProperties.indexOf(formatProp(name)) < 0;
        })
        .map(formatProp);
    }

    var operator =
      (props.length === 1
        ? "to have property "
        : "to have " + (this.anyOne ? "any of " : "") + "properties ") + props.join(", ");

    this.params = { obj: this.obj, operator: operator };

    //check that all properties presented
    //or if we request one of them that at least one them presented
    this.assert(
      missingProperties.length === 0 || (this.anyOne && missingProperties.length != names.length)
    );

    // check if values in object matched expected
    var valueCheckNames = Object.keys(values);
    if (valueCheckNames.length) {
      var wrongValues = [];
      props = [];

      // now check values, as there we have all properties
      valueCheckNames.forEach(function(name) {
        var value = values[name];
        if (eql(obj[name], value).length !== 0) {
          wrongValues.push(formatProp(name) + " of " + i(value) + " (got " + i(obj[name]) + ")");
        } else {
          props.push(formatProp(name) + " of " + i(value));
        }
      });

      if ((wrongValues.length !== 0 && !this.anyOne) || (this.anyOne && props.length === 0)) {
        props = wrongValues;
      }

      operator =
        (props.length === 1
          ? "to have property "
          : "to have " + (this.anyOne ? "any of " : "") + "properties ") + props.join(", ");

      this.params = { obj: this.obj, operator: operator };

      //if there is no not matched values
      //or there is at least one matched
      this.assert(
        wrongValues.length === 0 || (this.anyOne && wrongValues.length != valueCheckNames.length)
      );
    }
  });

  /**
   * Asserts given object has property `length` with given value `n`
   *
   * @name length
   * @alias Assertion#lengthOf
   * @memberOf Assertion
   * @category assertion property
   * @param {number} n Expected length
   * @param {string} [description] Optional message
   * @example
   *
   * [1, 2].should.have.length(2);
   */
  Assertion.add("length", function(n, description) {
    this.have.property("length", n, description);
  });

  Assertion.alias("length", "lengthOf");

  /**
   * Asserts given object has own property. **On success it change given object to be value of property**.
   *
   * @name ownProperty
   * @alias Assertion#hasOwnProperty
   * @memberOf Assertion
   * @category assertion property
   * @param {string} name Name of property
   * @param {string} [description] Optional message
   * @example
   *
   * ({ a: 10 }).should.have.ownProperty('a');
   */
  Assertion.add("ownProperty", function(name, description) {
    name = convertPropertyName(name);
    this.params = {
      actual: this.obj,
      operator: "to have own property " + formatProp(name),
      message: description
    };

    this.assert(hasOwnProperty(this.obj, name));

    this.obj = this.obj[name];
  });

  Assertion.alias("ownProperty", "hasOwnProperty");

  /**
   * Asserts given object is empty. For strings, arrays and arguments it checks .length property, for objects it checks keys.
   *
   * @name empty
   * @memberOf Assertion
   * @category assertion property
   * @example
   *
   * ''.should.be.empty();
   * [].should.be.empty();
   * ({}).should.be.empty();
   */
  Assertion.add(
    "empty",
    function() {
      this.params = { operator: "to be empty" };
      this.assert(isEmpty(this.obj));
    },
    true
  );

  /**
   * Asserts given object has such keys. Compared to `properties`, `keys` does not accept Object as a argument.
   * When calling via .key current object in assertion changed to value of this key
   *
   * @name keys
   * @alias Assertion#key
   * @memberOf Assertion
   * @category assertion property
   * @param {...*} keys Keys to check
   * @example
   *
   * ({ a: 10 }).should.have.keys('a');
   * ({ a: 10, b: 20 }).should.have.keys('a', 'b');
   * (new Map([[1, 2]])).should.have.key(1);
   *
   * json.should.have.only.keys('type', 'version')
   */
  Assertion.add("keys", function(keys) {
    keys = aSlice.call(arguments);

    var obj = Object(this.obj);

    // first check if some keys are missing
    var missingKeys = keys.filter(function(key) {
      return !hasKey(obj, key);
    });

    var verb = "to have " + (this.onlyThis ? "only " : "") + (keys.length === 1 ? "key " : "keys ");

    this.params = { operator: verb + keys.join(", ") };

    if (missingKeys.length > 0) {
      this.params.operator += "\n\tmissing keys: " + missingKeys.join(", ");
    }

    this.assert(missingKeys.length === 0);

    if (this.onlyThis) {
      should(obj).have.size(keys.length);
    }
  });

  Assertion.add("key", function(key) {
    this.have.keys(key);
    this.obj = getValue(this.obj, key);
  });

  /**
   * Asserts given object has such value for given key
   *
   * @name value
   * @memberOf Assertion
   * @category assertion property
   * @param {*} key Key to check
   * @param {*} value Value to check
   * @example
   *
   * ({ a: 10 }).should.have.value('a', 10);
   * (new Map([[1, 2]])).should.have.value(1, 2);
   */
  Assertion.add("value", function(key, value) {
    this.have.key(key).which.is.eql(value);
  });

  /**
   * Asserts given object has such size.
   *
   * @name size
   * @memberOf Assertion
   * @category assertion property
   * @param {number} s Size to check
   * @example
   *
   * ({ a: 10 }).should.have.size(1);
   * (new Map([[1, 2]])).should.have.size(1);
   */
  Assertion.add("size", function(s) {
    this.params = { operator: "to have size " + s };
    should(size(this.obj)).be.exactly(s);
  });

  /**
   * Asserts given object has nested property in depth by path. **On success it change given object to be value of final property**.
   *
   * @name propertyByPath
   * @memberOf Assertion
   * @category assertion property
   * @param {Array|...string} properties Properties path to search
   * @example
   *
   * ({ a: {b: 10}}).should.have.propertyByPath('a', 'b').eql(10);
   */
  Assertion.add("propertyByPath", function(properties) {
    properties = aSlice.call(arguments);

    var allProps = properties.map(formatProp);

    properties = properties.map(convertPropertyName);

    var obj = should(Object(this.obj));

    var foundProperties = [];

    var currentProperty;
    while (properties.length) {
      currentProperty = properties.shift();
      this.params = {
        operator:
          "to have property by path " +
          allProps.join(", ") +
          " - failed on " +
          formatProp(currentProperty)
      };
      obj = obj.have.property(currentProperty);
      foundProperties.push(currentProperty);
    }

    this.params = {
      obj: this.obj,
      operator: "to have property by path " + allProps.join(", ")
    };

    this.obj = obj.obj;
  });
}
