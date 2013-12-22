define([
	'conduct',
	'sammy',
	'director'
], function (conduct, Sammy, Router) {

	var noop = function () {},

		SEED = 100,

		testObj;

	
	// testObj = conduct()	

	benchmark('Register one route', function () {

		when('using Conduct.js', function () {
			conduct().connect('/user/edit/:number', noop)
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