var ComponentRouter = require('router-component'),
	conduttore = require('../../../lib/conduttore'),
	director = require('director'),

	testObj = conduttore(),
	componentRouter = new ComponentRouter,
	directorRouter = new director.http.Router


function noop () {}

function registerOneRouteWithComponentRouter () {
	componentRouter.get('/user/edit/:id', noop)
}

function registerOneRouteWithConductRouter () {
	testObj.connect('/user/edit/:number', noop)
}

function registerOneRouteWithDirectorRouter () {
	directorRouter.get('/user/edit/:number', noop)
}

module.exports = {
	name: 'Register one route',
	tests: {
		'with Component/Router': registerOneRouteWithComponentRouter,
		'with Conduct Router': registerOneRouteWithConductRouter,
		'with Director Router': registerOneRouteWithDirectorRouter
	}
}