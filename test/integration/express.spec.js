
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
			next()
		}, function () {
			res
			next()
		})
}

describe('conduttore', function () {

	before(function () {
		app = express()

		app.configure(function () {
			app.use(middleware)
		})
	})
	
	it('should do something', function (done) {
		request(app)
			.get('/users/edit/332')
			.expect('dunno', done)
	})

	it('should do something', function (done) {
		request(app)
			.get('/users/add')
			.expect(404, done)
	})
})