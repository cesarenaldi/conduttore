/** @license MIT License (c) copyright C Naldi */

/**
 * Licensed under the MIT License at:
 * http://www.opensource.org/licenses/mit-license.php
 */

(function(define){ 'use strict';
define(function(require) {
	return {
		TIGHT: 0,
		LOOSE: 1,
		LOOSEST: 2
	}
})
}(typeof define === 'function' ? define : function(factory) { module.exports = factory(require); }))