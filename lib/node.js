/** @license MIT License (c) copyright C Naldi */

/**
 * Licensed under the MIT License at:
 * http://www.opensource.org/licenses/mit-license.php
 */

(function(define){ 'use strict';
define(function(require) {

	var regexp = require('./matchers/regexp')

	var toString = Object.prototype.toString

	function isInstanceOf (obj, type) {
		return toString.call(obj) == '[object ' + type + ']'
	}

	function isFunction (obj) {
		return isInstanceOf(obj, 'Function')
	}

	function isRegExp (obj) {
		return isInstanceOf(obj, 'RegExp')
	}

	function isArray (obj) {
		return isInstanceOf(obj, 'Array')
	}

	var NodeSpecificity = {
		TIGHT: 0,
		LOOSE: 1,
		LOOSEST: 2
	}

	return {

		create: function create (type, match, specificity, value) {

			if (isFunction(match)) {

				specificity = specificity || NodeSpecificity.TIGHT

			} else if (isArray(match)) {

				match = '^' + match.join('|') + '$'
				match = new RegExp(match)
				match = regexp(match)

				specificity =  specificity || NodeSpecificity.LOOSE
			} else if (isRegExp(match)) {

				match = regexp(match)
				specificity =  specificity || NodeSpecificity.LOOSEST

			} else {
				throw new TypeError('Unsupported macther type.')
			}

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
		},

		Specificity: NodeSpecificity
	}
})
}(typeof define === 'function' ? define : function(factory) { module.exports = factory(require); }))