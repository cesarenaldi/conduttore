/** @license MIT License (c) copyright C Naldi */

/**
 * Licensed under the MIT License at:
 * http://www.opensource.org/licenses/mit-license.php
 */

(function(define){ 'use strict';
define(function(require) {
	
	var equal = require('./matchers/equal'),
		NodeSpecificity = require('./node').Specificity,

		isString = require('./utils/predicates').isString,

		idCounter = 0;

	function uniqueId (prefix) {
		var id = ++idCounter + '';
		return prefix ? prefix + id : id
	}

	function noop () {}
	
	var NodeFactory = function (nodeBuilder) {
		this._nodeBuilder = nodeBuilder
		this._types = {}
	}

	NodeFactory.prototype = {

		register: function (type, matcherOrType) {

			var types = this._types;

			if (isString(matcherOrType)) {
				types[type] = types[matcherOrType]
			} else {
				types[type] = matcherOrType
			}
		},

		create: function (type) {

			var types = this._types

			if (type in types) {
				return this._nodeBuilder(type, types[type])
			}
			return this._nodeBuilder(type, equal(type), NodeSpecificity.TIGHT)
		},

		createRoot: function () {
			return this._nodeBuilder(uniqueId('root-'), noop)
		},

		restore: function (node) {

			var types = this._types,
				type = node.type,
				match

			if ( !(type in types) ) {
				match = equal(type)
				types[type] = match
			} else {
				match = types[type]
			}
			
			node.match = match

			return node
		}
	}

	return NodeFactory

})
}(typeof define === 'function' ? define : function(factory) { module.exports = factory(require); }))