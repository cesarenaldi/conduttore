define(['underscore'], function (_) {

	'use strict';

	var AMD_REGEXP = /(define)\s*\(\s*(?:\s*["']([^"']*)["']\s*,)?(?:\s*\[([^\]]*)\]\s*,)?/,
		SPEC_REGEXP = /define\((\{.*\})\)/,
		ROUTES_REGEXP = /routes\s*:\s*{[^}]*}/,
		
		fs = require.nodeRequire('fs'),
		requirejs = require.nodeRequire('requirejs'),
		path = require.nodeRequire('path'),

		buildMap = {};


	function addQuotes (id) {
		return id.replace(/^['"]*([^'"]+)['"]*$/, '\'$1\'');
	}

	function resolveDependencies (config, name, raw) {

		var req, spec

		config = _.clone(config)
		config.isBuild = false
		config.context = +Date.now()

		req = require.config(config)

		spec = req(name)

		return _.chain(spec.routes)
					.values()
					.filter(_.isString)
					.value().splice(0, 1, 'underscore')
	}

	return {
		load: function (name, req, onload, config) {

			var text, deps;

			if ( ! req.defined(name) ) {

				text = String(fs.readFileSync(req.toUrl(name) + '.js', 'utf8'))
				
				onload.fromText(text)

				deps = resolveDependencies(config, name, text)

				req(deps.map(function (dep) {
					if (/\.\.?\//.test(dep)) {
						return path.join( path.dirname(name), dep )
					}
					return dep 
				}))
				
				buildMap[name] = {
					dependencies: deps,
					raw: text
				}
			}
		},

		write: function (pluginName, moduleName, write) {

			var module

			if (moduleName in buildMap) {
				
				module = buildMap[moduleName]

				write.asModule(moduleName, module.raw.replace(AMD_REGEXP, function (m, define, name, deps) {
					if (deps) {
						deps = deps.split(/,\s*/).concat(module.dependencies)
					} else {
						deps = module.dependencies
					}

					deps = deps.map(addQuotes)

					deps = _.uniq(deps)

					return define + '(' + addQuotes(moduleName) + ', [' + deps.join(', ') + '],'
				}))
			} else {
				throw new Error('Spec of "' + moduleName + '" was not previously processed');
			}
		}
	}
})