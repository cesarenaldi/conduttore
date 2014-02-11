define('puppa', [], {})

define([
	'underscore'
], function (_) {
	'use strict';

	/* jshint evil: true */

	var nodeRequire = require.nodeRequire,

		fs = nodeRequire('fs'),
		esprima = nodeRequire('esprima'),

		recast = nodeRequire('recast'),

		conduttore = nodeRequire(require.toUrl('conduttore')),

		traverse = recast.types.traverse,
		namedTypes = recast.types.namedTypes,
		builders = recast.types.builders,

		buildMap = {};

	/* jshint unused: false */
	function inspect (what) {
		console.log(nodeRequire('util').inspect(what, { depth: null }));
	}
	/* jshint unused: true */

	function addQuotes (id) {
		return id.replace(/^['"]*([^'"]+)['"]*$/, '\'$1\'');
	}

	function resolveDependencies (raw) {
		var ast = parseCode(raw),
			exports = extractExports(ast),
			dependencies = [],
			routes,
			builtRoutes

		if (exports) {
			routes = extractRoutes(exports)
			dependencies = extractDependencies(routes)
			replaceRoutesValues(routes)

			injectDependencies(ast, dependencies)

			builtRoutes = buildRoutes(printCode(exports))
			builtRoutes = jsToAST(builtRoutes)
			restoreRoutesValues(builtRoutes)

			replaceExportsRoutes(exports, builtRoutes)
		}
		return printCode(ast)
	}

	function isDefineCallExpression (node) {
		return namedTypes.CallExpression.check(node) && node.callee.name && node.callee.name === 'define'
	}

	function buildRoutes (routes) {
		var router = (new Function('conduttore', 'return conduttore(' + routes + ')')).call(null, conduttore)
		return router._tree.export()
	}

	function replaceRoutesValues (routes) {

		var nodes = []

		recast.types.traverse(routes, function (node) {
			if (namedTypes.Property.check(node)) {
				nodes.push(node)
			}
		})

		nodes.forEach(function (node) {
			node.value = createRouteValueDescriptor(node.value)
		})
	}

	function jsToAST (obj) {

		var fun = new Function('return ' + JSON.stringify(obj)),
			ast = parseCode(fun);

		return ast.body[0].body.body[0].argument
	}

	function replaceExportsRoutes (exports, builtRoutes) {
		traverse(exports, function (node) {
			if ( isExportsRoutesProperty(node) ) {
				node.value = builtRoutes
				return false
			}
		})
	}

	function restoreRoutesValues (builtRoutes) {
		traverse(builtRoutes, function (node) {
			if ( namedTypes.Property.check(node) && isRouteValueDescriptor(node.value) ) {
				node.value = decodeRouteValueDescriptor(node.value)
			}
		})
	}

	function isExportsRoutesProperty (node) {
		return namedTypes.Property.check(node)
			&& (
				(namedTypes.Identifier.check(node.key) && node.key.name === 'routes')
				||
				(namedTypes.Literal.check(node.key) && node.key.value === 'routes')
			)
	}

	function isRouteValueDescriptor (node) {
		return namedTypes.ObjectExpression.check(node)
			&& node.properties.length
			&& namedTypes.Property.check(node.properties[0])
			&& ( 
				(namedTypes.Literal.check(node.properties[0].key) && node.properties[0].key.value === 'type')
				||
				(namedTypes.Identifier.check(node.properties[0].key) && node.properties[0].key.name === 'type')
			)
	}

	function decodeRouteValueDescriptor (node) {

		var code = printCode(node)

		return (new Function('return ' + code)).call()
	}

	/**
	 * Given a route value node, returns the representation of the node using an AS Node
	 * @param  {Object} node - route value node
	 * @return {Object}
	 */
	function createRouteValueDescriptor (node) {
		// var code = '(' + JSON.stringify(node) + ')'
		// inspect( esprima.parse(code, { raw: true, tolerant: true, range: true }) )

		function createProperty (key, value) {
			return builders.property('init', builders.literal(key), builders.literal(value))
		}

		var props = [
			createProperty('type', node.type)
		]

		if (namedTypes.Literal.check(node)) {

			props.push( createProperty('value', node.value) )
			props.push( createProperty('raw', node.raw) )

		} else if (namedTypes.Identifier.check(node)) {

			props.push( createProperty('name', node.name) )

		} else {
			throw new Error('Invalid route value [' + node.type + ']. You can use a string or a function reference.')
		}

		return builders.objectExpression(props)
	}

	function injectDependencies (ast, dependencies) {

		dependencies = dependencies.map(recast.types.builders.literal)

		traverse(ast, function(node) {

			var args, deps

			if (isDefineCallExpression(node)) {
				args = node.arguments
				if (args.length > 1) {
					deps = args[args.length - 2]

					if ( namedTypes.ArrayExpression.check(deps) ) {
						deps.elements = deps.elements.concat(dependencies)
					} else {
						throw new Error('Invalid module definition. Missing dependencies array.')
					}
				} else {
					if ( namedTypes.FunctionExpression.check(args[0]) ) {
						throw new Error('Simplified CommonJS wrapper AMD definition not supported')
					}
					/** TODO insert depdenencies as first param */
				}
				return false
			}
		})
	}

	function extractDependencies (routes) {

		var dependencies = []

		traverse(routes, function(node) {
			if (namedTypes.Property.check(node) && node.value && namedTypes.Literal.check(node.value)) {
				dependencies.push(node.value.value)
			}
		})

		return dependencies
	}

	function extractRoutes (exports) {

		var routes = null

		traverse(exports, function (node) {
			if ( isExportsRoutesProperty(node) ) {
				routes = node.value
				return false
			}
		})
		
		return routes
	}

	function extractExports (ast) {

		var exports

		traverse(ast, function(node) {
			if (namedTypes.ReturnStatement.check(node) && node.argument !== null && namedTypes.ObjectExpression.check(node.argument)) {
				exports = node.argument
				return false
			}
		})

		return exports
	}

	function parseCode (raw) {
		return esprima.parse(raw, { raw: true, /* loc: true, tokens: true,*/ range: true })
	}

	function printCode (ast) {
		return recast.print(ast).code
	}

	return {

		load: function (name, req, onload, config) {

			var text, deps;

			if ( ! req.defined(name) ) {

				text = String(fs.readFileSync(req.toUrl(name) + '.js', 'utf8'))

				text = resolveDependencies(text)

				onload.fromText(text)
				
				buildMap[name] = {
					raw: text
				}
			}
		},

		write: function (pluginName, moduleName, write) {

			var module

			if (moduleName in buildMap) {
				
				module = buildMap[moduleName]

				write.asModule(moduleName, module.raw)
			} else {
				throw new Error('Spec of "' + moduleName + '" was not previously processed');
			}
		}
	}
})