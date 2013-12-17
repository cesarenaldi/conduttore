/** @license MIT License (c) copyright C Naldi */

/**
 * Licensed under the MIT License at:
 * http://www.opensource.org/licenses/mit-license.php
 */

(function(define){ 'use strict';
define(function(require) {

	return function createNode (type, match, specificity, value) {

		return {
			children: [ [], [], [] ],
			length: 0,
			levels: 0,
			lookup: {},
			match: match,
			specificity: specificity,
			type: type,
			value: value || null
		}
	}
	
})
}(typeof define === 'function' ? define : function(factory) { module.exports = factory(require); }))