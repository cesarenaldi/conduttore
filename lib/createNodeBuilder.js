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

	return function (type, matcher, specificity) {

		var builder

		if (_.isFunction(matcher)) {

			specificity = specificity || NodeSpecificity.TIGHT

		} else if (_.isArray(matcher)) {

			matcher = '^' + matcher.join('|') + '$'
			matcher = new RegExp(matcher)
			matcher = regexp(matcher)

			specificity =  specificity || NodeSpecificity.LOOSE
		} else if (_.isRegExp(matcher)) {

			matcher = regexp(matcher)
			specificity =  specificity || NodeSpecificity.LOOSEST

		} else {
			throw new TypeError('Unsupported macther type.')
		}

		builder =  _.partial(createNode, type, matcher, specificity)
		builder.matcher = matcher
		return builder
	}

})
}(typeof define === 'function' ? define : function(factory) { module.exports = factory(require); }))