var Router = require('router-component'),
	conduct = require('../../../lib/conduct'),

	testObj = conduct(),
	router = new Router;

function noop () {}

router.get('/:controller/:action/:id', noop)
testObj.connect('/*/*/:number', noop)

function resolveOneRouteWithComponentRouter () {
	router.dispatch('/users/edit/123')
}

function resolveOneRouteWithConductRouter () {
	var params = []
	testObj.resolve('/users/edit/123', params).apply(null, params)
}

module.exports = {
	name: 'Resolve one route',
	tests: {
		'with Component/Router': resolveOneRouteWithComponentRouter,
		'with Conduct Router': resolveOneRouteWithConductRouter
	}
}