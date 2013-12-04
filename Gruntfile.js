'use strict';

module.exports = function (grunt) {

    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks)

    grunt.initConfig({

        requirejs: {
            compile: {
                options: {
                    baseUrl: './lib',
                    name: 'conduct',
                    out: './dist/conduct.js',
                    // almond: true,
                    // wrap: true,
                    optimize: 'none',
                    paths: {
                        'underscore': '../bower_components/underscore-amd/underscore'
                    },
                    exclude: [
                        'underscore'
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
                      {pattern: 'test/spec/'+ grunt.option('file') +'.spec.js', included: false},
                      {pattern: 'lib/{,**/}*.js', included: false},

                      {pattern: 'test/libs/{,**/}*.js', included: false},

                      'test/SpecRunner.js'
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
    grunt.registerTask('build', ['requirejs:compile'])
    grunt.registerTask('default', ['test', 'build'])

};
