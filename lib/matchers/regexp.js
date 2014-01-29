/** @license MIT License (c) copyright C Naldi */

/**
 * Licensed under the MIT License at:
 * http://www.opensource.org/licenses/mit-license.php
 */

(function(define){ 'use strict';
define(function(require) {

	var remainder = require('../utils/remainder')

	function validateRegExp (re) {
		var source = re.source,
			lastIndex = source.length - 1

		if ( source.charAt(lastIndex) === '$' && source.charAt(lastIndex - 1) !== '\\') {
			throw new Error('Invalid regular expression. Please do NOT use the end-of-line anchor.')
		}
	}

	function identity (arg) {
		return arg
	}
	
	return function (re, parse) {

		validateRegExp(re)

		parse = parse || identity

		return function (target, params) {

			var match

			if (re.test(target)) {
				match = RegExp.lastMatch
				params.push( parse(match) )
				return remainder(target, match)
			}
			return false
		}
	}
	
})
}(typeof define === 'function' ? define : function(factory) { module.exports = factory(require); }))