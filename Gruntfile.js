'use strict';

var path = require('path')

module.exports = function (grunt) {

	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks)

	grunt.initConfig({

		file: grunt.option('file') ? grunt.option('file') : '**/*',

		requirejs: {
			dist: {
				options: {
					baseUrl: './lib',
					name: 'conduct',
					out: './dist/conduct.js',
					almond: true,
					wrap: true,
					optimize: 'uglify2',
					skipSemiColonInsertion: true,
					preserveLicenseComments: false,
					paths: {
						'underscore': '../bower_components/underscore-amd/underscore'
					},
					exclude: [
						'underscore',
						'when'
					],
					packages: [
						{ 
							name: 'when',
							location: '../bower_components/when',
							main: 'when'
						}
					],
					onBuildWrite: function (moduleName, path, contents) {
						return contents
							.replace("(function(define){ 'use strict';", '')
							.replace("}(typeof define === 'function' ? define : function(factory) { module.exports = factory(require); }))", '')
					}
				}
			},

			test: {
				options: {
					baseUrl: './',
					name: 'conduct!test/fixtures/pre-build-routes',
					out: '.tmp/routes.js',
					optimize: 'none',
					paths: {
						'underscore': 'bower_components/underscore-amd/underscore',
					},
					exclude: [
						'underscore',
						'conduct'
					],
					packages: [
						{ 
							name: 'when',
							location: 'bower_components/when',
							main: 'when'
						},
						{
							name: 'conduct',
							location: 'lib/',
							main: 'conduct.js'
						}
					]
				}
			},

			wire: {
				options: {
					baseUrl: './',
					name: 'wire!test/fixtures/wire-spec-test.js',
					out: '.tmp/wired.js',
					// almond: true,
					// wrap: true,
					optimize: 'none',
					paths: {
						// 'wire/builder/rjs': './tools/wire-rjs'
					},
					exclude: [],
					packages: [
						{
							name: 'wire',
							location: 'bower_components/wire',
							main: 'wire'
						}
					]
				}
			}
		},

		karma: {
			options: {
				configFile: 'karma.conf.js',
				runnerPort: 9999,
				files: [
					{pattern: 'bower_components/**/*.js', included: false},
					{pattern: 'test/spec/**/*.spec.js', included: false},
					{pattern: 'lib/{,**/}*.js', included: false},
					{pattern: 'test/fixtures/{,**/}*.js', included: false},
					{pattern: 'test/libs/{,**/}*.js', included: false},

					'test/SpecRunner.js'
				]
			},

			continuous: {
				singleRun: true,
				browsers: ['PhantomJS']
			},

			dev: {
				reporters: 'dots'
			},

			single: {
				reporters: 'dots',
				options: {
					files: [
						{pattern: 'bower_components/**/*.js', included: false},
						{pattern: 'test/spec/<%= file %>.spec.js', included: false},
						{pattern: 'lib/{,**/}*.js', included: false},
						{pattern: 'test/fixtures/{,**/}*.js', included: false},
						{pattern: 'test/libs/{,**/}*.js', included: false},

						'test/SpecRunner.js'
					]
				}
			},

			benchmark: {
				reporters: 'spec',
				options: {
					files: [
						{pattern: 'bower_components/**/*.js', included: false},
						{pattern: 'lib/{,**/}*.js', included: false},
						{pattern: 'dist/*.js', included: false},
						{pattern: 'test/perf/<%= file %>.perf.js', included: false},

						'test/PerfRunner.js'
					]
				}
			}
		},

		benchmark: {
			options: {
				displayResults: true
			},

			all: {
				src: ['benchmarks/*.js'],
				dest: 'benchmarks/results.csv'
			}
		}
	})

	grunt.registerTask('test', ['karma:continuous'])
	grunt.registerTask('build', ['requirejs:dist'])
	grunt.registerTask('default', ['test', 'build'])

}