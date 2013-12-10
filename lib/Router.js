/** @license MIT License (c) copyright C Naldi */

/**
 * Licensed under the MIT License at:
 * http://www.opensource.org/licenses/mit-license.php
 */

(function(define){ 'use strict';
define(function(require) {

	var _ , when, createTree, NodeFactory, createNodeBuilder, registerDefaultNodes, regexp;

	_ = require('underscore')
	when = require('when')
	createTree = require('./tree2')
	NodeFactory = require('./NodeFactory')
	createNodeBuilder = require('./createNodeBuilder')
	registerDefaultNodes = require('./registerDefaultNodes')
	regexp = require('./matchers/regexp')


	var Router = function (config) {
		this._factory = new NodeFactory(createNodeBuilder)
		
		registerDefaultNodes(this._factory)

		this._tree = createTree(this._factory, config && config.tree ? config.tree : undefined)
		this._delimiter = config && config.delimiter ? config.delimiter : '/'

		if (config) {

			if (config.params) {
				_.each(config.params, function (definition, name) {
					this.param(name, definition)
				}.bind(this))
			}

			if (config.aliases) {
				_.each(config.aliases, function (type, name) {
					this.alias(name, type)
				}.bind(this))
			}

			if (config.routes) {
				this.connect(config.routes)
			}
		}
	}

	Router.prototype = {

		/** @protected */
		_tokenize: function (path) {
			return path.split(this._delimiter)
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
		 * @param  {String} name parameter name
		 * @param  {String|String[]|function|RegExp} parameter definition
		 * @return {Router} self
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
		 * @param  {String} name [description]
		 * @param  {String} type [description]
		 * @return {Router} self
		 */
		alias: function (name, type) {
			this.param(name, type)
		},

		/**
		 * Register a new route or a set of routes.
		 * 
		 * @param  {String|Object} param1
		 * @param  {*} [param2=undefined]
		 * @return {Router} self
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
		 * @param  {String} path
		 * @param  {Array} params
		 * @return {*}
		 */
		resolve: function (path, params) {
			path = this._normalizePath(path)
			return this._tree.search( this._tokenize(path), params )
		},

		/**
		 * Resolve and invoke the callbacks associated to the given path passing the path parameters.
		 * 
		 * @param  {String} path
		 * @return {Promise}
		 */
		dispatch: function (path) {
			var params = [],

				deferred = when.defer(),

				value = this.resolve(path, params)

			if (value) {
				if (_.isFunction(value)) {
					_.defer(deferred.resolve, value.apply(value, params))
				} else if (_.isString(value)) {
					require([value], function (handler) {

						var result
						try {
							result = handler.apply(handler, params)
						} catch (e) {
							deferred.reject(e)
						}
						deferred.resolve(result)

					}, deferred.reject)
				} else {
					_.defer(deferred.resolve, value)
				}
			} else {
				_.defer(deferred.reject, new Error('Not found'))
			}
			return deferred.promise
		}
	}

	return Router

})
}(typeof define === 'function' ? define : function(factory) { module.exports = factory(require); }))