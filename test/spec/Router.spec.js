define([
	'Router',
	'fixtures/route-handler'
], function (Router, routeHandler) {


	describe('Router', function () {

		var LOOSE_ROUTES = [
				{ ':text': sinon.spy() },
				{ ':alphanumeric': sinon.spy() },
				{ ':number': sinon.spy() },
				{ '*': sinon.spy() }
			],
			DATE_ROUTES = [
				{ ':yyyy': sinon.spy() },
				{ ':mm': sinon.spy() },
				{ ':dd': sinon.spy() }
			],
			result, params

		describe('when registering routes', function () {

			var ONE_ROUTE = '/path1',
				MULTIPLE_ROUTES = [
					{ '/path2': true },
					{ '/path3': true }
				];

			var testObj = new Router()

			before(function () {
				testObj
					.connect(ONE_ROUTE, true)
					.connect(MULTIPLE_ROUTES)
			})

			it('should register one route at time', function () {
				result = testObj.resolve('/path1')
				expect(result).to.equal(true)
			})

			it('should register multiple routes at the same time', function () {
				result = testObj.resolve('/path2')
				expect(result).to.equal(true)
				result = testObj.resolve('/path3')
				expect(result).to.equal(true)
			})

			it('should raise an error if the routes is not a valid format', function () {
				function testCase () {
					testObj.connect(undefined)
				}
				expect(testCase).to.throw(Error)
			})
		})

		describe('when dealing with loose routes', function () {

			var testObj

			beforeEach(function () {
				params = []
				testObj = new Router()
			})

			it('should support text (i.e. string that use [a-zA-Z0-9_])', function () {
				testObj.connect(':text', LOOSE_ROUTES[0][':text'])
				result = testObj.resolve('/super_califragilistichespiralitoso_2', params)
				expect(result).to.equal(LOOSE_ROUTES[0][':text'])
				expect(params[0]).to.equal('super_califragilistichespiralitoso_2')
			})

			it('should support alphanumeric strings (i.e. string that use [a-zA-Z0-9])', function () {
				testObj.connect(':alphanumeric', LOOSE_ROUTES[1][':alphanumeric'])
				result = testObj.resolve('/ciano456', params)
				expect(result).to.equal(LOOSE_ROUTES[1][':alphanumeric'])
				expect(params[0]).to.equal('ciano456')
			})			

			it('should support integers', function () {
				testObj.connect(':number', LOOSE_ROUTES[2][':number'])
				result = testObj.resolve('/1234', params)
				expect(result).to.equal(LOOSE_ROUTES[2][':number'])
				expect(params[0]).to.equal(1234)
			})

			it('should support decimals', function () {
				testObj.connect(':number', LOOSE_ROUTES[2][':number'])
				result = testObj.resolve('/0.1234', params)
				expect(result).to.equal(LOOSE_ROUTES[2][':number'])
				expect(params[0]).to.equal(0.1234)
			})

			it('should support loose wildcards', function () {
				testObj.connect('*', LOOSE_ROUTES[3]['*'])
				result = testObj.resolve('/paperino-3_1_3', params)
				expect(result).to.equal(LOOSE_ROUTES[3]['*'])
				expect(params[0]).to.equal('paperino-3_1_3')
			})
		})

		describe('when dealing with date parts', function () {

			var testObj = new Router();

			before(function () {
				testObj.connect(DATE_ROUTES)
			})

			beforeEach(function () {
				params = []
			})

			it('should support 4 digits years', function () {
				result = testObj.resolve('/1983', params)
				expect(result).to.equal(DATE_ROUTES[0][':yyyy'])
				expect(params[0]).to.equal(1983)
			})

			it('should support 2 digits months', function () {
				result = testObj.resolve('/02', params)
				expect(result).to.equal(DATE_ROUTES[1][':mm'])
				expect(params[0]).to.equal(2)
			})

			it('should support 2 digits days', function () {
				result = testObj.resolve('/27', params)
				expect(result).to.equal(DATE_ROUTES[2][':dd'])
				expect(params[0]).to.equal(27)
			})
		})


		describe('when dealing with composite routes', function () {

			var testObj = new Router();

			before(function () {
				testObj
					.connect('/:yyyy/:mm', true)
					.connect('/:yyyy/:mm/:dd', true)
					
					.connect('/news/:yyyy/:mm/:dd/*', true)
					.connect('/news/*', true)
			})

			beforeEach(function () {
				params = []
			})

			it('should support dates with yyyy/mm format', function () {
				result = testObj.resolve('/1983/02', params)
				expect(result).to.be.true
				expect(params).to.deep.equal([1983, 2])
			})

			it('should support dates with yyyy/mm/dd format', function () {
				result = testObj.resolve('/1983/02/27', params)
				expect(result).to.be.true
				expect(params).to.deep.equal([1983, 2, 27])
			})

			it('should support wildcards', function () {
				result = testObj.resolve('/news/today', params)
				expect(result).to.be.true
				expect(params).to.deep.equal(['today'])
			})

			it('should support typical blog routes', function () {
				result = testObj.resolve('/news/1983/02/27/i-was-born', params)
				expect(result).to.be.true
				expect(params).to.deep.equal([1983, 2, 27, 'i-was-born'])
			})
		})

		describe('when dealing with UNION parameters', function () {

			var testObj = new Router();

			before(function () {
				testObj
					.param(':places', ['work', 'home'])
					.connect('/:places', true)
			})

			beforeEach(function () {
				params = []
			})

			it('should resolve values inside the specified set', function () {
				result = testObj.resolve('/home', params)
				expect(result).to.be.true
				expect(params[0]).to.equal('home')

				params = []
				result = testObj.resolve('/work', params)
				expect(result).to.be.true
				expect(params[0]).to.equal('work')
			})

			it('should return undefined otherwise', function () {
				result = testObj.resolve('/notHomeOrWork', params)
				expect(result).to.equal(undefined)
				expect(params.length).to.equal(0)
			})
		})

		describe('when dealing with CUSTOM parameters', function () {
			
		})

		describe('when dealing with', function () {

			var testObj = new Router();

			before(function () {
				testObj
					.connect('/user/:number', true)
			})

			beforeEach(function () {
				params = []
			})

			describe('/user/:number', function () {
				it('should resolve correctly', function () {
					result = testObj.resolve('user/123', params)
					expect(result).to.be.true
				})
			})
		})

		describe('when dealing with complex configurations:', function () {

			beforeEach(function () {
				params = []
			})

			describe('loose routes registered before and after a more specific route', function () {
				var testObj = new Router(),
					LOOSE_ROUTE = 1,
					LOOSE_3_TOKENS_ROUTE = 2
					SPECIFIC_3_TOKENS_ROUTE = 3;

				before(function () {
					testObj
						.connect('/users/*', LOOSE_ROUTE)
						.connect('/users/add/:number', SPECIFIC_3_TOKENS_ROUTE)
						.connect('/users/*/:number', LOOSE_3_TOKENS_ROUTE)
				})

				it('should resolve paths with compatible number of tokens and specificity', function () {
					result = testObj.resolve('/users/add/123', params)
					expect(result).to.equal(SPECIFIC_3_TOKENS_ROUTE, 'expected /users/add/:number route to match')
				})
			})

			describe('interleaved loose routes and specific router', function () {
				var testObj = new Router(),
					LOOSE_2_TOKENS_ROUTE = 1,
					SPECIFIC_2_TOKENS_ROUTE = 2
					LOOSE_3_TOKENS_ROUTE = 3
					SPECIFIC_3_TOKENS_ROUTE = 4;

				before(function () {
					testObj
						.connect('/users/index', SPECIFIC_2_TOKENS_ROUTE)
						.connect('/users/*', LOOSE_2_TOKENS_ROUTE)
						.connect('/users/add/:number', SPECIFIC_3_TOKENS_ROUTE)
						.connect('/users/*/:number', LOOSE_3_TOKENS_ROUTE)
				})

				it('should resolve paths with compatible number of tokens and specificity', function () {
					result = testObj.resolve('/users/index', params)
					expect(result).to.equal(SPECIFIC_2_TOKENS_ROUTE, 'expected /users/index route to match')
				})

			})
		})

		describe.skip('#alias', function () {
			it('should have a test', function () {
				expect(false).to.be.true
			})
		})

		describe('when dispatching on a "path"', function () {

			var ROUTE = '/topolino/:number',
				PATH = '/topolino/123',
				EXPECTED_PARAM = 123

			it('should return a promise', function () {
				var testObj = new Router(),
					promise

				testObj.connect(ROUTE, function () {})
				promise = testObj.dispatch(PATH)
				expect(promise).to.have.property('then')
					.that.is.an.instanceof(Function)
			})

			it('should reject the promise in case of not found value for the specified path', function (done) {
				var testObj = new Router()
				testObj.dispatch('not/matching/path').then(function () {
					done('Expected to be rejected')
				}, function (err) {
					done()
				})
			})
			
			describe.skip('and the value is a function', function () {

				it('should invoke the function passing the parameters collected', function () {
					expect(false).to.be.true
				})
			})

			describe('and the value is a string', function () {

				var EXISTING_MODULE = 'fixtures/route-handler',
					testObj = new Router()

				it('should try to load the corresponding module and invoke the function', function (done) {
					testObj.connect(ROUTE, EXISTING_MODULE)
					testObj.dispatch(PATH).then(function () {
						expect(routeHandler).to.be.calledWith(EXPECTED_PARAM)
						done()
					}, done)
				})

				it('should handle missing module rejecting the promise', function (done) {
					testObj.connect(ROUTE, 'unknown/module')

					testObj.dispatch(PATH).then(function () {
						done('Expected to be rejected')
					}, function (err) {
						done()
					})
				})

				it('should handle invalid handler exports rejecting the promise', function (done) {
					testObj.connect(ROUTE, 'fixtures/invalid-handler-module')

					testObj.dispatch(PATH).then(function () {
						done('Expected to be rejected')
					}, function (err) {
						done()
					})
				})
			})

			describe.skip('and the value is not a function or a string', function () {

				it('should resolve the promise with the found value', function () {
					expect(false).to.be.true
				})
			})
		})

		describe('when routes are provided in the costructor', function () {
			
			it('should support such routes', function (done) {
				var CONFIG = {
						routes: [
							{ '/user/:number': sinon.spy() }
						]
					},
					testObj = new Router(CONFIG)
				testObj.dispatch('/user/123').then(function () {
					expect(CONFIG.routes[0]['/user/:number']).to.be.called
					done()
				}, done)
			})
		})

		describe('when parameter definitions are provided in the costructor', function () {
			
			it('should support such parameters', function (done) {
				var CONFIG = {
						params: {
							':dummy': sinon.stub().returns(true)
						},
						routes: [
							{ '/:dummy': sinon.spy() }
						]
					},
					testObj = new Router(CONFIG)

				testObj.dispatch('/dunno').then(function () {
					expect(CONFIG.routes[0]['/:dummy']).to.be.called
					done()
				}, done)
				
			})
		})

		describe('when parameter aliases are provided in the costructor', function () {
			
			it('should support such parameters', function (done) {
				var CONFIG = {
						aliases: {
							':alias': ':dummy'
						},
						params: {
							':dummy': sinon.stub().returns(true)
						},
						routes: [
							{ '/:alias': sinon.spy() }
						]
					},
					testObj = new Router(CONFIG)

				testObj.dispatch('/dunno').then(function () {
					expect(CONFIG.routes[0]['/:alias']).to.be.called
					done()
				}, done)
			})
		})
	})
})