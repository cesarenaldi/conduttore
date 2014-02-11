/** @license MIT License (c) copyright C Naldi */

/**
 * Licensed under the MIT License at:
 * http://www.opensource.org/licenses/mit-license.php
 */

(function(define){ 'use strict';
define(function(require) {

	var toString = Object.prototype.toString

	function isInstanceOf (obj, type) {
		return toString.call(obj) === '[object ' + type + ']'
	}

	return {
		isFunction: function isFunction (obj) {
			return isInstanceOf(obj, 'Function')
		},

		isRegExp: function isRegExp (obj) {
			return isInstanceOf(obj, 'RegExp')
		},

		isArray: function isArray (obj) {
			return isInstanceOf(obj, 'Array')
		},
		
		isString: function isString (obj) {
			return isInstanceOf(obj, 'String')
		},

		isObject: function isObject (obj) {
			return obj === Object(obj)
		}
	}

})
}(typeof define === 'function' ? define : function(factory) { module.exports = factory(require); }))