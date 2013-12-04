var Router = require('router-component'),
	conduct = require('../lib/conduct'),

	testObj = conduct(),
	router = new Router,

	SEED = 100


function noop () {}

function registerOneRoutesWithComponentRouter () {
	router.get('/user/'+ Math.random() * SEED +'/:id', noop)
}

function registerOneRoutesWithConductRouter () {
	testObj.connect('/user/'+ Math.random() * SEED +'/:number', noop)
}

module.exports = {
	name: 'Register one route',
	tests: {
		'with Component/Router': registerOneRoutesWithComponentRouter,
		'with Conduct Router': registerOneRoutesWithConductRouter
	}
}