define([
	'conduttore',
	'sammy',
	'director'
], function (conduttore, Sammy, Router) {

	var noop = function () {},

		SEED = 100,

		testObj;


	benchmark('Register one route', function () {

		when('using Conduttore.js', function () {
			conduttore().connect('/user/edit/:number', noop)
		})

		when('using Sammy.js', function () {
			Sammy('body', function () {
				this.get('#/user/edit/:id', noop)
			})
		})

		when('using Director.js', function () {
			var router, routes

			routes = {}

			routes['/user/edit/:number'] = noop

			router = new Router(routes)
		})
	})
})