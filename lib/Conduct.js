/** @license MIT License (c) copyright C Naldi */

/**
 * Licensed under the MIT License at:
 * http://www.opensource.org/licenses/mit-license.php
 */

(function(define){ 'use strict';
define(function(require) {
	
	var Router = require('./Router')

	conduct.version = '0.1.0'

	/**
	 * Main API.
	 *
	 * 
	 * @return {Promise} [description]
	 */
	function conduct (routes) {
		return new Router()
	}


	/**
	 * AMD Loader plugin API
	 * @param  {String}	resourceId - The resource ID that the plugin should load.
	 * @param  {Function} require - A local require function to use to load other modules.
	 * @param  {Function} load - A function to call once the value of the resource ID has been determined.
	 * @param  {Object} [config] - Optional. A configuration object.
	 */
	conduct.load = function (name, require, load, config) {}

	return conduct

})
}(typeof define === 'function' ? define : function(factory) { module.exports = factory(require); }))