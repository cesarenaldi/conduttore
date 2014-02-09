/** @license MIT License (c) copyright C Naldi */

/**
 * Licensed under the MIT License at:
 * http://www.opensource.org/licenses/mit-license.php
 */

(function(define){ 'use strict';
define(function(require) {

	var predicates = require('./predicates')

	var slice = Array.prototype.slice,
		hasOwnProp = Object.prototype.hasOwnProperty,

		isObject = predicates.isObject,
		isArray = predicates.isArray

	return {
		each: function each (obj, iterator) {
			var k
			for (k in obj) {
				if (hasOwnProp.call(obj, k)) {
					iterator.call(obj, obj[k], k)
				}
			}
		},

		defer: function defer (func /* , varags */) {
			var params = slice.call(arguments, 1)
			setTimeout(function () {
				func.apply(func, params)
			}, 0)
		},

		compose: function compose() {
			var funcs = arguments;
			return function() {
				var args = arguments;
				for (var i = funcs.length - 1; i >= 0; i--) {
					args = [funcs[i].apply(this, args)]
				}
				return args[0]
			}
		},

		pairs: function pairs (obj) {
			var keys = Object.keys(obj),
				length = keys.length,
				pairs = new Array(length),
				i

			for (i = 0; i < length; i++) {
				pairs[i] = [keys[i], obj[keys[i]]];
			}
			return pairs;
		},

		first: function first (array) {
			return array[0]
		},

		clone: function clone (array) {
			return slice.call(array)
		}
	}

})
}(typeof define === 'function' ? define : function(factory) { module.exports = factory(require); }))