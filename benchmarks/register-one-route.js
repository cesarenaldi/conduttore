var Router = require('router-component'),
	Conduct = require('../lib/index'),

	testObj = Conduct.createRouter(),
	router = new Router;


function noop () {}

function registerOneRoutesWithComponentRouter () {
	router.get('/user/:id', noop)
}

function registerOneRoutesWithConductRouter () {
	testObj.connect('/user/:number', noop)
}

module.exports = {
	name: 'Register one route',
	tests: {
		'with Component/Router': registerOneRoutesWithComponentRouter,
		'with Conduct Router': registerOneRoutesWithConductRouter
	}
}