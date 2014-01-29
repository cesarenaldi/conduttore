/** @license MIT License (c) copyright C Naldi */

/**
 * Licensed under the MIT License at:
 * http://www.opensource.org/licenses/mit-license.php
 */

(function(define){ 'use strict';
define(function(require) {

	var regexp = require('./regexp')

	return function (re) {

		re = re || /^\-?\d+(?:\.\d+)?/

		return regexp(re, Number)
	}
	
})
}(typeof define === 'function' ? define : function(factory) { module.exports = factory(require); }))