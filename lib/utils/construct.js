/** @license MIT License (c) copyright C Naldi */

/**
 * Licensed under the MIT License at:
 * http://www.opensource.org/licenses/mit-license.php
 */

(function(define){ 'use strict';
define(function(require) {

	return function construct (Ctor /*, varargs */) {
		// console.log('>>>>', arguments)
		var Surrogate = function () {},
			obj

		Surrogate.prototype = Ctor.prototype
		obj = new Surrogate
		Ctor.apply(obj, Array.prototype.slice.call(arguments, 1))
		return obj
	}

})
}(typeof define === 'function' ? define : function(factory) { module.exports = factory(require); }))