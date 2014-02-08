'use strict';

var path = require('path')

module.exports = function (grunt) {

	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks)

	var _ = require('underscore')

	grunt.initConfig({

		file: grunt.option('file') ? grunt.option('file') : '**/*',

		requirejs: {
			dist: {
				options: {
					baseUrl: './lib',
					name: 'conduttore',
					out: './dist/conduttore.js',
					almond: true,
					wrap: {
						startFile: 'parts/start.frag',
						endFile: 'parts/end.frag'
					},
					optimize: 'uglify2',
					skipSemiColonInsertion: true,
					preserveLicenseComments: true,
					paths: {},
					exclude: [
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
					name: 'conduttore!test/fixtures/pre-build-routes',
					out: '.tmp/routes.js',
					optimize: 'none',
					paths: {
						'underscore': 'bower_components/underscore-amd/underscore',
					},
					exclude: [
						'underscore',
						'conduttore'
					],
					packages: [
						{ 
							name: 'when',
							location: 'bower_components/when',
							main: 'when'
						},
						{
							name: 'conduttore',
							location: 'lib/',
							main: 'conduttore.js'
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
				src: ['test/perf/node/*.js'],
				dest: 'test/perf/node/results.csv'
			},

			single: {
				src: ['test/perf/node/<%= file %>.js'],
				dest: '/tmp/benchmarks/node/' + _.uniqueId('results') + '.csv'
			}
		}
	})

	grunt.registerTask('test', ['karma:continuous'])
	grunt.registerTask('perf', ['build', 'benchmark:all'])
	grunt.registerTask('build', ['requirejs:dist'])
	grunt.registerTask('default', ['test', 'build'])

}