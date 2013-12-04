/** @license MIT License (c) copyright C Naldi */

/**
 * Licensed under the MIT License at:
 * http://www.opensource.org/licenses/mit-license.php
 */

(function(define){ 'use strict';
define(function(require) {

	var _ = require('underscore')
	
	var Node = function (type, match, specificity, value) {
		this._type = type
		this._match = match
		this._specificity = specificity
		this._value = value || false
		this._parent = null
		this._levels = 0
		this._children = [
			[],
			[],
			[]
		]
	}

	Node.prototype = {

		get levels () {
			return this._levels
		},

		set levels (levels) {
			var diff = levels - this._levels
			this._levels = levels
			if (this._parent) {
				this._parent.levels += diff
			}
		},

		set parent (node) {
			this._parent = node
		},

		get value () {
			return this._value
		},

		set value (value) {
			this._value = value
		},

		get length () {
			return _.reduce(this._children, function (acc, nodes) {
				return acc + nodes.length
			}, 0)
		},

		get specificity () {
			return this._specificity
		},

		equal: function (node) {
			return this._type.toString() === node._type.toString()
		},

		insert: function (node) {
			var nth = this._find(node),
				children = this._children

			if (nth) {
				return nth
			}
			if (this.length == 0) {
				this.levels++
			}
			node.parent = this
			children[node._specificity].push(node)
			return node
		},

		first: function (token, levels, params) {
			var children = this._children,
				specs = children.length,
				i, length, j, child, result, nodes;

			for (i = 0; i < specs; i++) {
				nodes = children[i]
				length = nodes.length
				for (j = 0; j < length; j++) {
					child = nodes[j]
					result = child.match(token, levels, params)
					if (result === true) {
						return child
					}
				}
			}
			return undefined
		},

		match: function (token, levels, params) {
			if (levels > this._levels) {
				return false
			}
			return this._match(token, params)
		},

		/** @protected */
		_find: function (node) {
			var children = this._children,
				specificity = node._specificity
			if (! specificity in children) {
				return undefined
			}
			return _.find(children[specificity], function (nth) {
				return nth.equal(node)
			})
		}
	}

	return Node

})
}(typeof define === 'function' ? define : function(factory) { module.exports = factory(require); }))