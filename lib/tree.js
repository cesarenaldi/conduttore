/** @license MIT License (c) copyright C Naldi */

/**
 * Licensed under the MIT License at:
 * http://www.opensource.org/licenses/mit-license.php
 */

(function(define){ 'use strict';
define(function(require) {

	var predicates = require('./utils/predicates'),
		functions = require('./utils/functions'),
		searchIterator = require('searchIterator')

	var isObject = predicates.isObject,
		clone = functions.clone

	require('./vendor/cycle')

	var Tree = function (nodeFactory, data) {
		this._nodeFactory = nodeFactory
		this._root = data || nodeFactory.createRoot()
		this._visited = []
		this._searchIteraror = searchIterator(this._search.bind(this))
	};

	Tree.prototype = {
		
		insert: function (path, value) {
			var nodeFactory = this._nodeFactory,
				visited = [],
				leaf;

			leaf = this._walk(path, visited, function (node, pattern) {
				var lookup = node.lookup,
					child = lookup[pattern],
					i

				if (! child ) {
					child = nodeFactory.create(pattern)

					lookup[child.type] = child
					node.children[child.specificity].push(child)

					if (node.levels === 0) {
						i = visited.length
						while (i--) {
							visited[i].levels++
						}
					}
				}

				return child
			})

			leaf.value = value
		},

		search: function (tokens, params) {
			return this._searchIteraror(tokens, params)
		},

		_search: function (tokens, params, state) {

			var found, visited;

			visited = []

			found = this._walk(tokens, visited, function (node, token, remaining) {
				var children, specs,
					i, length, j, child, result, nodes;

				if (remaining > node.levels) {
					return
				}

				children = node.children
				specs = children.length

				for (i = 0; i < specs; i++) {
					nodes = children[i]
					length = nodes.length
					for (j = 0; j < length; j++) {
						child = nodes[j]
						result = child.match(token, params)
						if (result === true) {
							return child
						}
					}
				}
			})
			
			if (found) {
				return found.value
			}
			visited = []
		},

		continue: function *() {

			var node;

			node = this._visited.pop()

			yield node

			if ( !node ) {
				throw new Error('Impossible to continue the previous search')
			}
		},

		export: function () {
			// TODO investingate a more efficient solution to remove methods from nodes
			return JSON.parse( JSON.stringify( JSON.decycle(this._root) ) )
		},

		import: function (data) {
			var self = this
			// TODO investigate a more efficient way to traverse and restore match function on the tree nodes
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
		_walk: function (steps, visited, iterator) {
			var len = steps.length,
				i = len,
				node, args;

			if (!len) {
				return
			}

			steps = clone(steps).reverse()
			node = this._root

			while (i-- && node) {
				visited.push(node)
				args = [ node, steps[i], i ]
				node = iterator.apply(this, args)
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