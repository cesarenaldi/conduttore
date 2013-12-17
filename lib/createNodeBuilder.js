/** @license MIT License (c) copyright C Naldi */

/**
 * Licensed under the MIT License at:
 * http://www.opensource.org/licenses/mit-license.php
 */

(function(define){ 'use strict';
define(function(require) {

	var _ = require('underscore'),
		construct = require('./utils/construct'),
		createNode = require('./createNode'),
		regexp = require('./matchers/regexp'),

		NodeSpecificity = require('./specificity');

	function normalize (matcher) {
		if (_.isFunction(matcher)) {
			return matcher
		}
		if (_.isArray(matcher)) {
			matcher = '^' + matcher.join('|') + '$'
			matcher = new RegExp(matcher)
		}
		if (_.isRegExp(matcher)) {
			return regexp(matcher)
		}
		throw new TypeError('Unsupported macther type.')
	}

	function detectSpecificity (matcher) {
		if (_.isFunction(matcher)) {
			return NodeSpecificity.TIGHT
		}
		if (_.isArray(matcher)) {
			return NodeSpecificity.LOOSE
		}
		if (_.isRegExp(matcher)) {
			return NodeSpecificity.LOOSEST
		}
	}

	return function (type, matcher, specificity) {

		var builder

		specificity = specificity || detectSpecificity(matcher)
		matcher = normalize(matcher)

		builder =  _.partial(createNode, type, matcher, specificity)
		builder.matcher = matcher
		return builder
	}

})
}(typeof define === 'function' ? define : function(factory) { module.exports = factory(require); }))