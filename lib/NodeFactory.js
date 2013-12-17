/** @license MIT License (c) copyright C Naldi */

/**
 * Licensed under the MIT License at:
 * http://www.opensource.org/licenses/mit-license.php
 */

(function(define){ 'use strict';
define(function(require) {
	
	var _ = require('underscore'),
		equal = require('./matchers/equal'),
		NodeSpecificity = require('./specificity'),
		slice = Array.prototype.slice

	function noop () {}
	
	var NodeFactory = function (buildFactory) {
		this._buildFactory = buildFactory
		this._types = {}
	}

	NodeFactory.prototype = {

		register: function (type, matcherOrType /* , specificity */) {

			var build = this._buildFactory,
				types = this._types;

			if (_.isString(matcherOrType)) {
				types[type] = types[matcherOrType]
			} else {
				types[type] = build.apply(build, slice.call(arguments))
			}
		},

		create: function (type /** , value */) {

			var types = this._types,
				factory

			if (type in types) {
				factory = types[type]
				return factory()
			}
			return this._buildFactory(type, equal(type), NodeSpecificity.TIGHT).call()
		},

		createRoot: function () {
			return this._buildFactory(_.uniqueId('root-'), noop).call()
		},

		restore: function (node) {

			var types = this._types,
				type = node.type

			if (type in types) {
				node.match = types[type].matcher
			} else {
				node.match = equal(type).matcher
			}
			return node
		}
	}

	return NodeFactory

})
}(typeof define === 'function' ? define : function(factory) { module.exports = factory(require); }))