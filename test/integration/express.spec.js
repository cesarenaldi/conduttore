
var conduttore = require('../../lib/conduttore'),

	express = require('express'),

	request = require('supertest'),

	sinon = require('sinon'),

	app, router

router = conduttore()

router.connect('/users/edit/:number', sinon.stub().returns('dunno'))

function middleware (req, res, next){

	var url = req.url.split('?', 1)[0]

	router
		.dispatch(url)
		.then(function (ret) {
			res.send(ret)
		}, function () {
			res.send(404, 'Sorry cant find that!')
		})
}

describe('conduttore + express.js', function () {

	before(function () {
		app = express()

		app.configure(function () {
			app.use(middleware)
		})
	})
	
	it('should dispatch the path to the route handler and return the result', function (done) {
		request(app)
			.get('/users/edit/332')
			.expect('dunno', done)
	})

	it('should return 404 if the path does not match any routes', function (done) {
		request(app)
			.get('/not-exists')
			.expect(404	, done)
	})
})