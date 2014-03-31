'use strict';

module.exports = function (grunt) {

	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks)

	var _ = require('underscore')

	grunt.initConfig({

		file: grunt.option('file') ? grunt.option('file') : '**/*',

		browserify: {
			options: {
				standalone: 'conduttore',
				fullPaths: true,
				detectGlobals: false,
				ignore: ['when']
			},
			dist: {
				files: {
					'dist/conduttore.js': 'lib/conduttore.js'
				}
			}
		},

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
				reporters: 'spec',
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

		mochaTest: {
			options: {
				reporter: 'spec'
			},
			integration: {
				src:[
					'test/integration/*.spec.js'
				]
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
		},

		jshint: {
			gruntfile: {
				options: {
					jshintrc: '.jshintrc'
				},
				src: 'Gruntfile.js'
			},
			lib: {
				options: {
					jshintrc: 'lib/.jshintrc'
				},
				src: [
					'lib/**/*.js',
					'!lib/vendor/**/*.js'
				]
			},
			test: {
				options: {
					jshintrc: 'test/.jshintrc'
				},
				src: ['test/**/*.js']
			}
		},

		bump: {
			options: {
				files: ['package.json', 'bower.json'],
				updateConfigs: [],
				commit: true,
				commitMessage: 'Release v%VERSION%',
				commitFiles: ['-a'],
				createTag: true,
				tagName: '%VERSION%',
				tagMessage: 'v%VERSION%',
				push: false,
				pushTo: 'upstream',
				gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d' // options to use with '$ git describe'
			}
		},
		'git-add': {
			options: {
				files: [
					'package.json',
					'bower.json',
					'dist/*'
				]
			}
		}
	})

	grunt.loadTasks('grunt/tasks')

	grunt.registerTask('test', ['jshint:gruntfile', 'jshint:lib', 'karma:continuous', 'mochaTest:integration'])
	grunt.registerTask('perf', ['build', 'benchmark:all'])
	grunt.registerTask('build', ['browserify'])
	grunt.registerTask('release', function (target) {
		grunt.task.run(['build', 'bump-only:' + target, 'git-add', 'bump-commit'])
	})
	grunt.registerTask('default', ['test'])

}