/** @license MIT License (c) copyright C Naldi */

/**
 * Licensed under the MIT License at:
 * http://www.opensource.org/licenses/mit-license.php
 */

(function(define){ 'use strict';
define(function(require) {
	
	var Conduct = require('./Conduct')

	return {
		createRouter: function (sep) {
			return new Conduct(sep)
		}
	}

})
}(typeof define === 'function' ? define : function(factory) { module.exports = factory(require); }))