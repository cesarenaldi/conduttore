/** @license MIT License (c) copyright C Naldi */

/**
 * Licensed under the MIT License at:
 * http://www.opensource.org/licenses/mit-license.php
 */

(function(define){ 'use strict';
define(function(require) {

	var _ = require('underscore')

	var Tree = function (nodeFactory) {
		this._nodeFactory = nodeFactory
		this._root = nodeFactory.createRoot()
	};

	Tree.prototype = {
		insert: function (atoms, value) {
			var len = atoms.length,
				i = len,
				nodeFactory = this._nodeFactory,
				node, next;

			atoms = _.clone(atoms).reverse()

			if (!len) {
				return
			}

			node = this._root

			while (i--) {
				next = nodeFactory.create(atoms[i])
				node = node.insert(next)
			}
			node.value = value
		},

		search: function (tokens, params) {
			var node = this._root,
				len = tokens.length,
				i = len;

			tokens = _.clone(tokens).reverse()

			while (i-- && node) {
				node = node.first(tokens[i], i, params)
			}
			if (node) {
				return node.value
			}
			// console.log('here',tokens, i)
			return undefined
		}
	};

	return Tree

})
}(typeof define === 'function' ? define : function(factory) { module.exports = factory(require); }))