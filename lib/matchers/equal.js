/** @license MIT License (c) copyright C Naldi */

/**
 * Licensed under the MIT License at:
 * http://www.opensource.org/licenses/mit-license.php
 */

(function(define){ 'use strict';
define(function(require) {
	
	return function (to) {
		return function (token) {
			return token === to
		}
	}

})
}(typeof define === 'function' ? define : function(factory) { module.exports = factory(require); }))