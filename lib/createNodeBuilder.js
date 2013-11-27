/** @license MIT License (c) copyright C Naldi */

/**
 * Licensed under the MIT License at:
 * http://www.opensource.org/licenses/mit-license.php
 */

(function(define){ 'use strict';
define(function(require) {

	var _ = require('underscore'),
		construct = require('./utils/construct'),
		Node = require('./Node'),
		regexp = require('./matchers/regexp'),

		NodeSpecificity = Node.Specificity,

		constructNode = _.partial(construct, Node);

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
		specificity = specificity || detectSpecificity(matcher)
		matcher = normalize(matcher)
		return _.partial(constructNode, type, matcher, specificity)
	}

})
}(typeof define === 'function' ? define : function(factory) { module.exports = factory(require); }))