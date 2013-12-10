/** @license MIT License (c) copyright C Naldi */

/**
 * Licensed under the MIT License at:
 * http://www.opensource.org/licenses/mit-license.php
 */

(function(define){ 'use strict';
define(function(require) {

	var _ = require('underscore')

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
					node = lookup[pattern];

				if (! node ) {
					node = nodeFactory.create(pattern)

					lookup[node.type] = node
					this.children[node.specificity].push(node)

					if (this.levels === 0) {
						_.each(nodes, function (node) {
							node.levels++
						})
					}
				}

				nodes.push(node)

				return node
			})

			leaf.value = value
		},

		search: function (tokens, params) {
			// console.profile('Tree#search')
			var leaf;

			leaf = this._walk(tokens, function (token, remaining) {
				// console.profile('Tree search iterator')
				var children, specs,
					i, length, j, child, result, nodes;

				if (remaining > this.levels) {
					// console.profileEnd('Tree search iterator')
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
							// console.profileEnd('Tree search iterator')
							return child
						}
					}
				}
				// console.profileEnd('Tree search iterator')
			})
			// console.profileEnd('Tree#search')
			if (leaf) {
				return leaf.value
			}
		},

		toJSON: function () {
			return this._root
		},

		/** @protected */
		_walk: function (steps, iterator) {
			// console.profile('Tree#_walk')
			var len = steps.length,
				i = len,
				node, args;

			if (!len) {
				// console.profileEnd('Tree#_walk')
				return
			}

			steps = _.clone(steps).reverse()
			node = this._root

			while (i-- && node) {
				args = [ steps[i], i ]
				node = iterator.apply(node, args)
			}
			if (node) {
				// console.profileEnd('Tree#_walk')
				return node
			}
		}
	};

	return function (nodeFactory, data) {
		return new Tree(nodeFactory, data)
	}

})
}(typeof define === 'function' ? define : function(factory) { module.exports = factory(require); }))