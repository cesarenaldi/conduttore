/** @license MIT License (c) copyright C Naldi */

/**
 * Licensed under the MIT License at:
 * http://www.opensource.org/licenses/mit-license.php
 */

(function(define){ 'use strict';
define(function(require) {

	var _ , Tree, NodeFactory, createNodeBuilder, registerDefaultNodes, regexp;

	_ = require('underscore')
	Tree = require('./Tree')
	NodeFactory = require('./NodeFactory')
	createNodeBuilder = require('./createNodeBuilder')
	registerDefaultNodes = require('./registerDefaultNodes')
	regexp = require('./matchers/regexp')


	var Conduct = function (sep) {
		this._factory = new NodeFactory(createNodeBuilder)
		
		registerDefaultNodes(this._factory)

		this._tree = new Tree(this._factory)
		this._sep = sep || '/'
	}

	Conduct.prototype = {

		constructor: Conduct,

		/** @protected */
		_tokenize: function (path) {
			return path.split(this._sep)
		},

		/** @protected */
		_normalizePath: function (route) {
			// TODO remove trailing slash
			return route.replace(/^\//, '')
		},

		/** @protected */
		_normalizeName: function (name) {
			// TODO normalize param names (e.g. initial :)
			return name
		},

		/**
		 * Adds a new parameter type to the set of available parameter to be use inside a route.
		 * 
		 * @param  {string} name parameter name
		 * @param  {string|string[]|function|RegExp} parameter definition
		 * @return {Conduct} self
		 */
		param: function (name, definition) {
			this._factory.register(
				this._normalizeName(name),
				definition
			)
			return this
		},

		/**
		 * Adds an alias for an already existing param type.
		 * 
		 * @param  {string} name [description]
		 * @param  {string} type [description]
		 * @return {Conduct} self
		 */
		alias: function (name, type) {
			throw new Error('Not implemented')
		},

		/**
		 * Register a new route or a set of routes.
		 * 
		 * @param  {string|object} param1
		 * @param  {*} [param2=undefined]
		 * @return {Conduct} self
		 */
		connect: function (param1, param2) {
			var routes;

			if (arguments.length == 2) {
				routes = {}
				routes[param1] = param2
			} else if (_.isObject(param1)) {
				routes = param1
			} else {
				throw new Error('Invalid routes.')
			}

			_.each(routes, function (value, route) {
				route = this._normalizePath(route)
				this._tree.insert( this._tokenize(route), value )
			}.bind(this))
			return this
		},

		/**
		 * Resolve the path to the resources collecting eventual extracted data into the params array.
		 * 
		 * @param  {string} path
		 * @param  {Array} params
		 * @return {*}
		 */
		resolve: function (path, params) {
			path = this._normalizePath(path)
			return this._tree.search( this._tokenize(path), params )
		}
	}

	return Conduct

})
}(typeof define === 'function' ? define : function(factory) { module.exports = factory(require); }))