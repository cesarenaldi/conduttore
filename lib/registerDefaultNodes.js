/** @license MIT License (c) copyright C Naldi */

/**
 * Licensed under the MIT License at:
 * http://www.opensource.org/licenses/mit-license.php
 */

(function(define){ 'use strict';
define(function(require) {

	var number = require('./matchers/number'),
		regexp = require('./matchers/regexp'),
		NodeSpecificity = require('./Node').Specificity

	var yyyy = /^(\d{4})$/,

		mm = /^(0[1-9]|1[0-2])$/,

		dd = /^(0?[1-9]|[12][0-9]|3[01])$/,

		text = /^[\w-_]+$/,

		alphanumeric = /^[\w]+$/


	return function defaultNodes(factory) {

		factory.register( ':number', number() )
		factory.register( ':yyyy', number(yyyy) )
		factory.register( ':mm', number(mm) )
		factory.register( ':dd', number(dd) )
		factory.register( ':alphanumeric', alphanumeric )
		factory.register( ':text', text )
		factory.register( '*', text )

		// TODO: currencies?
	}

})
}(typeof define === 'function' ? define : function(factory) { module.exports = factory(require); }))