/** @license MIT License (c) copyright C Naldi */

/**
 * Licensed under the MIT License at:
 * http://www.opensource.org/licenses/mit-license.php
 */

(function(define){ 'use strict';
define(function(require) {

	var predicates = require('./utils/predicates'),
		functions = require('./utils/functions')

	var isObject = predicates.isObject,
		clone = functions.clone

	require('./vendor/cycle')

	var Tree = function (nodeFactory, data) {
		this._nodeFactory = nodeFactory
		this._root = data || nodeFactory.createRoot()
	};

	Tree.prototype = {
		
		insert: function (route, value) {
			var nodeFactory = this._nodeFactory,
				nodes = [this._root],
				leaf;

			leaf = this._iterate(route, function (pattern) {
				var lookup = this.lookup,
					node = lookup[pattern],
					i

				if (! node ) {
					node = nodeFactory.create(pattern)

					lookup[node.type] = node
					this.children[node.specificity].push(node)

					if (this.levels === 0) {
						i = nodes.length
						while (i--) {
							nodes[i].levels++
						}
					}
				}

				nodes.push(node)

				return node
			})

			leaf.value = value
		},

		search: function (path, params) {
			return this._walk(this._root, path, params)
		},

		_walk: function walk (node, path, params) {

			var next

			if (path.length === 0) {
				return
			}

			next = this._find(node, path, params)

			if (!next) {
				return
			}

			if (next[1] === true) {
				return next[0].value
			}

			next.push(params)

			return walk.apply(this, next)
		},

		_find: function (node, path, params) {

			var children, specs,
				i, length, j, child, result, nodes

			children = node.children
			specs = children.length

			for (i = 0; i < specs; i++) {
				nodes = children[i]
				length = nodes.length
				for (j = 0; j < length; j++) {
					child = nodes[j]
					result = child.match(path, params)
					if (result !== false) {
						return [child, result]
					}
				}
			}
		},

		export: function () {
			// TODO investingate a more efficient solution to remove methods from nodes
			return JSON.parse( JSON.stringify( JSON.decycle(this._root) ) )
		},

		import: function (data) {
			var self = this

			data = JSON.stringify(data)
			data = JSON.parse(data, function (k, v) {
				if (isObject(v) && typeof v.type !== 'undefined') {
					self._nodeFactory.restore(v)
				}
				return v
			})
			this._root = JSON.retrocycle(data)
		},

		/** @protected */
		_iterate: function (steps, iterator) {
			var len = steps.length,
				i = len,
				node, args;

			if (!len) {
				return
			}

			steps = clone(steps).reverse()
			node = this._root

			while (i-- && node) {
				args = [ steps[i], i ]
				node = iterator.apply(node, args)
			}
			if (node) {
				return node
			}
		}
	};

	return function (nodeFactory, data) {
		return new Tree(nodeFactory, data)
	}

})
}(typeof define === 'function' ? define : function(factory) { module.exports = factory(require); }))