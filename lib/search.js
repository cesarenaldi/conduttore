/** @license MIT License (c) copyright C Naldi */

/**
 * Licensed under the MIT License at:
 * http://www.opensource.org/licenses/mit-license.php
 */

(function(define){ 'use strict';
define(function(require) {

	var clone = require('./utils/functions').clone

	function walk (token, params, remaining) {
		var node = this.node,

			groups, groupsNums, i,
			nodes, groupLength, j, child, result,

			idx = this.idx;

		if (remaining > node.levels) {
			return false
		}

		groups = node.children
		groupsNums = groups.length

		for (i = 0; i < groupsNums; i++) {
			nodes = groups[i]
			groupLength = nodes.length
console.log('i', i)
console.log('idx', idx)
console.log('node.type', node.type)
console.log('groupLength', groupLength)
			if ( idx >= groupLength ) {
				idx -= groupLength
				continue	
			}

			for (j = idx; j < groupLength; j++) {

				child = nodes[j]
				result = child.match(token, params)

				if (result === true) {
					this.idx++
					return child
				}
				// this.idx++
			}
		}

		return false
	}

	return function (root) {

		return function (tokens, params) {

			var idx = tokens.length - 1,

				ctx = {
					node: root,
					idx: 0
				},

				traversed = [ctx]

			tokens = clone(tokens).reverse()

			return {
				next: function (/* notused */) {

					console.log('\n\nnew search', tokens)

					var ctx = traversed[traversed.length - 1],
						node

					do {

						node = walk.call(ctx, tokens[idx], params, idx)

						if (node) {
							ctx = {
								idx: 0,
								node: node
							}
							idx--
							if (idx > 0) {
								traversed.push(ctx)
							}							
						} else {
							ctx = traversed.pop()
							idx++
						}

						// console.log('idx', idx)
						// console.log('ctx', ctx.node.type, ctx.idx)
						console.log('traversed', traversed.map(function (ctx) { return ctx.node.type + ':' + ctx.idx }))

					} while (idx > -1 && ctx)

					if (node) {
						// console.log('result', node.value)
						return { done: false, value: node.value }
					}
					return { done: true, value: undefined }
				}
			}
		}
	}
})
}(typeof define === 'function' ? define : function(factory) { module.exports = factory(require); }))