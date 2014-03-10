/** @license MIT License (c) copyright C Naldi */

/**
 * Licensed under the MIT License at:
 * http://www.opensource.org/licenses/mit-license.php
 */

(function(define){ 'use strict';
define(function(require) {

	function createIterResultObj (value, done) {
		return { value: value, done: done }
	}

	return function (search) {

		return function createSearchIterator (tokens, params) {
			var state = {
				idx: 0,
				visited: []
			}

			return {
				next: function () {
					var result = search(tokens, params, state)
					if (result) {
						return createIterResultObj(result, false)
					}
					return createIterResultObj(undefined, true)
				}
			}
		}
	}
})
}(typeof define === 'function' ? define : function(factory) { module.exports = factory(require); }))