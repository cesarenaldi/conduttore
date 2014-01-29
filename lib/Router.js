/** @license MIT License (c) copyright C Naldi */

/**
 * Licensed under the MIT License at:
 * http://www.opensource.org/licenses/mit-license.php
 */

(function(define){ 'use strict';
define(function(require) {

	var when = require('when'),
		
		predicates = require('./utils/predicates'),
		functions = require('./utils/functions'),
		createTree = require('./tree'),
		NodeFactory = require('./NodeFactory'),
		createNode = require('./node').create,
		registerDefaultNodes = require('./registerDefaultNodes')

	var isArray = predicates.isArray,
		isObject = predicates.isObject,
		isFunction = predicates.isFunction,
		isString = predicates.isString

	var each = functions.each,
		defer = functions.defer,
		compose = functions.compose,
		first = functions.first,
		pairs = functions.pairs

	var Router = function (config) {
		this._factory = new NodeFactory(createNode)
		
		registerDefaultNodes(this._factory)

		this._tree = createTree(this._factory)
		this._delimiter = config && config.delimiter ? config.delimiter : '/' //(?:\:[a-z0-9_]+)/i

		if (config) {

			if (config.params) {
				each(config.params, function (definition, name) {
					this.param(name, definition)
				}.bind(this))
			}

			if (config.aliases) {
				each(config.aliases, function (type, name) {
					this.alias(name, type)
				}.bind(this))
			}

			if (config.routes) {
				if (isArray(config.routes)) {

					this.connect(config.routes)

				} else if (isObject(config.routes)) {

					this._tree.import(config.routes)

				}
			}
		}
	}

	Router.prototype = {

		/** @protected */
		_tokenize: function (path) {
			return path.split(this._delimiter)
			return path
				.split(this._delimiter)
				.reduce(function (acc, token) {
					if (token.length) {
						return acc.push(token)
					}
					return acc
				}, [])
		},

		/** @protected */
		_normalizePath: function (route) {
			// TODO remove trailing slash?
			if ( route.indexOf('/') === 0 ) {
				return route.slice(1)
			}
			return route
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
		 * @param  {String|Object[]} param1
		 * @param  {*} [param2=undefined]
		 * @return {Router} self
		 */
		connect: function (param1, param2) {
			var route

			if (param2) {

				route = this._normalizePath(param1)
				route = this._tokenize(route)
				this._tree.insert(route, param2)

			} else if (isArray(param1)) {

				param1.forEach( compose(this.connect.apply.bind(this.connect, this), first, pairs) )
			} else {

				throw new Error('Invalid routes.')
			}			
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
				if (isFunction(value)) {
					defer(deferred.resolve, value.apply(value, params))
				} else if (isString(value)) {
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
					defer(deferred.resolve, value)
				}
			} else {
				defer(deferred.reject, new Error('Not found'))
			}
			return deferred.promise
		}
	}

	return Router

})
}(typeof define === 'function' ? define : function(factory) { module.exports = factory(require); }))