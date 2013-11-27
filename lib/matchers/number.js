/** @license MIT License (c) copyright C Naldi */

/**
 * Licensed under the MIT License at:
 * http://www.opensource.org/licenses/mit-license.php
 */

(function(define){ 'use strict';
define(function(require) {

	return function (re) {

		re = re || /^(\-?\d+(?:\.\d+)?)$/

		return function (token, params) {
			var value;
			if (re.test(token)) {
				value = Number(RegExp.$1)
				params.push(value)
				return true
			}
			return false
		}
	}
	
})
}(typeof define === 'function' ? define : function(factory) { module.exports = factory(require); }))