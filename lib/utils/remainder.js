/** @license MIT License (c) copyright C Naldi */

/**
 * Licensed under the MIT License at:
 * http://www.opensource.org/licenses/mit-license.php
 */

(function(define){ 'use strict';
define(function(require) {
	
	/**
	 * Returns the remainder between the target string and the match string.
	 * Returns true if the two string are equals (i.e. no remainder).
	 * 
	 * @param  {String} target
	 * @param  {String} match
	 * @return {String|Boolean}
	 */
	return function remainder (target, match) {
		return target === match ? true : target.substring(match.length)
	}
	
})
}(typeof define === 'function' ? define : function(factory) { module.exports = factory(require); }))