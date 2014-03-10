define([
	'searchIterator'
], function (searchIteratorFactory) {

	var searchStub = sinon.stub(),
		searchIterator = searchIteratorFactory(searchStub)
	
	describe('Search iterator', function () {

		describe('when creating a new search iterator', function () {

			it('should return an iterator-like object', function () {
				var iter = searchIterator(['path', 'to', 'somewhere'], [])

				expect(iter)
					.to.respondTo('next')
			})
		})

		describe('when iterating over the searches', function () {

			var NEW_STATE = {
					idx: 3,
					visited: ['dunno']
				},
				PATH = ['path', 'to', 'somewhere'],
				PARAMS = []

			before(function () {
				
			})

			it('should interact with the search function providing a state object', function () {
				var iter = searchIterator(PATH, PARAMS),
					iterResult = iter.next()

				expect(searchStub)
					.to.be.calledWith(PATH, PARAMS, sinon.match.object)
			})

			it('should pass the updated state object to the subsequent search iterations', function () {
				var iter = searchIterator(['path', 'to', 'somewhere'], []),
					iterResult = iter.next()

				expect(searchStub)
					.to.be.calledWith(PATH, PARAMS, sinon.match.object)
			})
		})

		describe('when the search provides a result', function () {

			var RESULT = 'pluto'

			before(function () {
				searchStub.returns(RESULT)
			})

			it('should return an iterator result object with the result in the value key', function () {
				var iter = searchIterator(['path', 'to', 'somewhere'], []),
					iterResult = iter.next()

				expect(iterResult)
					.to.deep.equal({
						done: false,
						value: RESULT
					})
			})
		})

		describe('when the search does not provide a result', function () {

			before(function () {
				searchStub.returns(undefined)
			})

			it('should return an iterator result object that notify the end of the search iteration', function () {
				var iter = searchIterator(['path', 'to', 'somewhere'], []),
					iterResult = iter.next()

				expect(iterResult)
					.to.deep.equal({
						done: true,
						value: undefined
					})
			})
		})
		
	})
})