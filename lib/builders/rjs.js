define(['underscore'], function (_) {

	'use strict';

	var AMD_REGEXP = /(define)\s*\(\s*(?:\s*["']([^"']*)["']\s*,)?(?:\s*\[([^\]]*)\]\s*,)?/,
		// SPEC_REGEXP = /define\((\{.*\})\)/,
		// ROUTES_REGEXP = /routes\s*:\s*{[^}]*}/,
		
		nodeRequire = require.nodeRequire,

		fs = nodeRequire('fs'),
		requirejs = nodeRequire('requirejs'),
		esprima = nodeRequire('esprima'),
		path = nodeRequire('path'),
		traverse = nodeRequire('ast-traverse'),
		util = nodeRequire('util'),
		when = nodeRequire('when'),
		recast = nodeRequire('recast'),

		buildMap = {};


	function addQuotes (id) {
		return id.replace(/^['"]*([^'"]+)['"]*$/, '\'$1\'');
	}

	function resolveDependencies (raw) {
		var ast = parseModule(raw),
			exports = extractExports(ast),
			dependencies = []

		if (exports) {
			dependencies = extractDependencies(exports)
			injectDependencies(ast, dependencies)
		}
		return recast.print(ast).code
	}

	function injectDependencies (ast, dependencies) {
		var b = recast.types.builders

		dependencies = dependencies.map(function (dep) {
			return b.literal(dep)
		})

		traverse(ast, {
			pre: function(node) {
				var args, deps, dep
				if (node.type === 'CallExpression' && node.callee && node.callee.name && node.callee.name == 'define') {
					args = node.arguments
					if (args.length > 1) {
						deps = args[args.length - 2]
						console.log()
						if (deps.type !== 'ArrayExpression') {
							throw new Error('Invalid module definition.')
						}
						deps.elements = deps.elements.concat(dependencies)
					} else {
						if (args[0].type === 'FunctionExpression') {
							throw new Error('Simplified CommonJS wrapper AMD definition not supported')
						}
						/** TODO insert first param */
					}
					return false
				}
			}
		})
	}

	function extractDependencies (node) {
		var parentFound = false,
			dependencies = []

		traverse(node, {
			pre: function(node) {
				if (node.type === 'Property') {
					if (node.key && node.key.name === 'routes') {
						parentFound = true
					} else if (parentFound && node.value && node.value.type === 'Literal') {
						dependencies.push(node.value.value)
					}
				}
			}
		})

		return dependencies
	}

	function extractExports (ast) {

		var exports

		traverse(ast, {
			pre: function(node) {
				if (node.type === 'ReturnStatement' && node.argument !== null && node.argument.type === 'ObjectExpression') {
					exports = node.argument
					// console.log(raw.slice.apply(raw, node.argument.range))
					// console.log(util.inspect(node.argument, { depth: null }));
					return false
				}

			}
		})

		return exports
	}

	function parseModule (raw) {
		return recast.parse(raw)
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