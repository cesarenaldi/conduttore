/** @license MIT License (c) copyright C Naldi */

/**
 * Licensed under the MIT License at:
 * http://www.opensource.org/licenses/mit-license.php
 */

(function(define){ 'use strict';
define(function(require) {
	
	var Router = require('./Router'),

		conduttore

	/**
	 * Main API.
	 *
	 * @return {object} spec [description]
	 */
	conduttore = function conduttore (spec) {
		return new Router(spec)
	}

	conduttore.version = '0.1.0'

	/**
	 * AMD Loader plugin API
	 * @param  {String}	name - The resource ID that the plugin should load.
	 * @param  {Function} require - A local require function to use to load other modules.
	 * @param  {Function} onload - A function to call once the value of the resource ID has been determined.
	 * @param  {Object} [config] - Optional. A configuration object.
	 */
	conduttore.load = function (name, req, onload /*, config */) {
		req([name], function (spec) {
			onload(new Router(spec))
		})
	}

	/**
	 * AMD Builder plugin API
	 */
	conduttore.pluginBuilder = './builders/rjs';

	return conduttore

})
}(typeof define === 'function' ? define : function(factory) { module.exports = factory(require); }))