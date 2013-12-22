/** @license MIT License (c) copyright C Naldi */

/**
 * Licensed under the MIT License at:
 * http://www.opensource.org/licenses/mit-license.php
 */

(function(define){ 'use strict';
define(function(require) {

	var _ = require('underscore')

	require('./vendor/cycle')

	var Tree = function (nodeFactory, data) {
		this._nodeFactory = nodeFactory
		this._root = data || nodeFactory.createRoot()
	};

	Tree.prototype = {
		
		insert: function (path, value) {
			var nodeFactory = this._nodeFactory,
				nodes = [this._root],
				leaf;

			leaf = this._walk(path, function (pattern) {
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

		search: function (tokens, params) {
			var leaf;

			leaf = this._walk(tokens, function (token, remaining) {
				var children, specs,
					i, length, j, child, result, nodes;

				if (remaining > this.levels) {
					return
				}

				children = this.children
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
			if (leaf) {
				return leaf.value
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
				if (_.isObject(v) && typeof v.type !== 'undefined') {
					self._nodeFactory.restore(v)
				}
				return v
			})
			this._root = JSON.retrocycle(data)
		},

		/** @protected */
		_walk: function (steps, iterator) {
			var len = steps.length,
				i = len,
				node, args;

			if (!len) {
				return
			}

			steps = _.clone(steps).reverse()
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