/** @license MIT License (c) copyright C Naldi */

/**
 * Licensed under the MIT License at:
 * http://www.opensource.org/licenses/mit-license.php
 */

(function(define){ 'use strict';
define(function(require) {
	
	var _ = require('underscore'),
		equal = require('./matchers/equal'),
		NodeSpecificity = require('./specificity')

	function noop () {}
	
	var NodeFactory = function (buildFactory) {
		this._buildFactory = buildFactory
		this._types = {}
	};

	NodeFactory.prototype = {

		register: function (type, matcher /* , specificity */) {
			var build = this._buildFactory
			this._types[type] = build.apply(build, _.toArray(arguments))
		},

		create: function (type /** , value */) {

			var types = this._types,
				factory

			if (type in types) {
				factory = types[type]
				return factory.apply(factory, _.rest(arguments))
			}
			return this._buildFactory(type, equal(type), NodeSpecificity.TIGHT).apply(null, _.rest(arguments))
		},

		createRoot: function () {
			return this._buildFactory(_.uniqueId('root-'), noop).call()
		}
	};

	return NodeFactory

})
}(typeof define === 'function' ? define : function(factory) { module.exports = factory(require); }))