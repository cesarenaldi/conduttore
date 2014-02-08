var ComponentRouter = require('router-component'),
	conduct = require('../../../lib/conduct'),
	director = require('director'),

	testObj = conduct(),
	componentRouter = new ComponentRouter,
	directorRouter = new director.http.Router

	SEED = 100


function noop () {}

function registerThousandRoutesWithComponentRouter () {
	for (var i = 0; i < 1000; i++ )
		componentRouter.get('/user/'+ Math.random() * SEED +'/:id', noop)
}

function registerThousandRoutesWithConductRouter () {
	for (var i = 0; i < 1000; i++ )
		testObj.connect('/user/'+ Math.random() * SEED +'/:number', noop)
}

function registerThousandRoutesWithDirectorRouter () {
	for (var i = 0; i < 1000; i++ )
		directorRouter.get('/user/'+ Math.random() * SEED +'/:number', noop)
}

module.exports = {
	name: 'Register one route',
	tests: {
		'with Component/Router': registerThousandRoutesWithComponentRouter,
		'with Conduct Router': registerThousandRoutesWithConductRouter,
		'with Director Router': registerThousandRoutesWithDirectorRouter
	}
}