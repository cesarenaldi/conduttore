var Router = require('router-component'),
	conduct = require('../lib/conduct'),

	testObj = conduct(),
	router = new Router,

	SEED = 100


function noop () {}

function registerThousandRoutesWithComponentRouter () {
	for (var i = 0; i < 1000; i++ )
		router.get('/user/'+ Math.random() * SEED +'/:id', noop)
}

function registerThousandRoutesWithConductRouter () {
	for (var i = 0; i < 1000; i++ )
		testObj.connect('/user/'+ Math.random() * SEED +'/:number', noop)
}

module.exports = {
	name: 'Register one route',
	tests: {
		'with Component/Router': registerThousandRoutesWithComponentRouter,
		'with Conduct Router': registerThousandRoutesWithConductRouter
	}
}