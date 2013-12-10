var requirejs = require('requirejs')

requirejs.config({
	baseUrl: './',
	paths: {
		'underscore': '../bower_components/underscore-amd/underscore'
	},
	packages: [
        {
            name: 'wire',
            location: 'bower_components/wire',
            main: 'wire'
        },
        { name: 'when', location: '../bower_components/when', main: 'when' }
    ]
})

var routes = requirejs('test/fixtures/pre-build-routes')
console.log(routes)

module.exports = routes