/** @license MIT License (c) copyright C Naldi */

/**
 * Licensed under the MIT License at:
 * http://www.opensource.org/licenses/mit-license.php
 */

(function(define){ 'use strict';
define(function(require) {
	
	return function (re) {
		return function (token, params) {

			if (re.test(token)) {
				params.push(RegExp.lastMatch)
				return true
			}
			return false
		}
	}
	
})
}(typeof define === 'function' ? define : function(factory) { module.exports = factory(require); }))