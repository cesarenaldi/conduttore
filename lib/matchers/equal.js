/** @license MIT License (c) copyright C Naldi */

/**
 * Licensed under the MIT License at:
 * http://www.opensource.org/licenses/mit-license.php
 */

(function(define){ 'use strict';
define(function(require) {
	
	var remainder = require('../utils/remainder')

	return function (to) {
		return function (target) {
			if (target.indexOf(to) === 0) {
				return remainder(target, to)
			}
			return false
		}
	}

})
}(typeof define === 'function' ? define : function(factory) { module.exports = factory(require); }))