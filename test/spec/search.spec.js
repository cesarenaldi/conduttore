define([
	'search',
	'node'
], function (search, node) {


	var INTERMEDIATE_NODE_1_RESULT = 'intermediate_node_1_result',
		INTERMEDIATE_NODE_2_RESULT = 'intermediate_node_2_result',
		TOPOLINO_PLUTO_RESULT_1 = 'result_1',
		TOPOLINO_PLUTO_RESULT_2 = 'result_2',
		TOPOLINO_PLUTO_RESULT_3 = 'result_3',

		NODE_1_1 = {
			type: 'leaf',
			match: sinon.stub()
				.withArgs('pluto').returns(true),
			value: TOPOLINO_PLUTO_RESULT_1,
			children: [ [], [], [] ]
		},

		NODE_1_2 = {
			type: 'leaf_1_1',
			match: sinon.stub()
				.withArgs('pluto').returns(true),
			value: 'not important',
			children: [ [], [], [] ]
		},

		NODE_1_3 = {
			type: 'leaf_1_2',
			match: sinon.stub()
				.returns(false),
			value: TOPOLINO_PLUTO_RESULT_2,
			children: [ [], [], [] ]
		},

		NODE_1 = {
			type: 'node_1',
			match: sinon.stub()
				.withArgs('topolino').returns(true),
			value: INTERMEDIATE_NODE_1_RESULT,
			children: [
				[ NODE_1_1, NODE_1_2 ], [ NODE_1_3 ], []
			]
		},

		NODE_2_1 = {
			type: 'leaf_2_1',
			match: sinon.stub()
				.withArgs('pluto').returns(true),
			value: TOPOLINO_PLUTO_RESULT_3,
			children: [ [], [], [] ]
		},

		NODE_2 = {
			type: 'node_2',
			match: sinon.stub()
				.withArgs('topolino').returns(true),
			value: INTERMEDIATE_NODE_2_RESULT,
			children: [
				[], [ NODE_2_1 ], []
			]
		},

		ROOT = {
			type: 'root',
			match: function notused () {},
			children: [
				[], [ NODE_1, NODE_2 ], []
			]
		},

		MULTIPLE_RESULTS_SEARCH = ['topolino', 'pluto'],
		INTERMEDIATE_RESULT_SEARCH = ['topolino']

	search = search(ROOT)

	describe('tree search', function () {
	
		describe('when performing a search', function () {
			
			it('should return an iterator-like object', function () {
				var iter = search(['random', 'search'], [])

				expect(iter)
					.to.respondTo('next')
			})
		})

		describe('when iterating over search results', function () {

			it('should find value on leaf node', function () {
				var iter = search(MULTIPLE_RESULTS_SEARCH, []),
					iterResultObj = iter.next()

				expect(iterResultObj)
					.to.deep.equal({
						done: false,
						value: TOPOLINO_PLUTO_RESULT_1
					})
			})

			it('should pass the parameters accumulator to the match functions', function () {
				var params = [],
					iter = search(MULTIPLE_RESULTS_SEARCH, params)

				iter.next()

				expect(NODE_1.match)
					.to.be.calledWith(MULTIPLE_RESULTS_SEARCH[0], params)
				expect(NODE_1_1.match)
					.to.be.calledWith(MULTIPLE_RESULTS_SEARCH[1], params)
			})

			it('should find value on intermediate nodes', function () {
				var iter = search(INTERMEDIATE_RESULT_SEARCH, []),
					result1 = iter.next(),
					result2 = iter.next()

				expect(result1)
					.to.deep.equal({
						done: false,
						value: INTERMEDIATE_NODE_1_RESULT
					})
				expect(result2)
					.to.deep.equal({
						done: false,
						value: INTERMEDIATE_NODE_2_RESULT
					})
			})

			it('should return all the found values', function () {
console.log('\nthis test\n')				
				var iter = search(MULTIPLE_RESULTS_SEARCH, []),
					result1 = iter.next(),
					result2 = iter.next(),
					result3 = iter.next()
console.log(result1, result2, result3)
				expect(result1)
					.to.deep.equal({
						done: false,
						value: TOPOLINO_PLUTO_RESULT_1
					}, 'expected result to be the first search result')

				expect(result2)
					.to.deep.equal({
						done: false,
						value: TOPOLINO_PLUTO_RESULT_2
					}, 'expected result to be the second search result')

				expect(result3)
					.to.deep.equal({
						done: false,
						value: TOPOLINO_PLUTO_RESULT_3
					}, 'expected result to be the third search result')
			})

			it.skip('should return parameters for the current search iteration', function () {
				expect(false).to.be.true
			})

			it.skip('should notify when the search results are over', function () {
				var iter = search(MULTIPLE_RESULTS_SEARCH, []),
					iterResultObj
				
				iter.next() // result 1
				iter.next() // result 2
				iter.next() // result 3

				iterResultObj = iter.next() // undefined

				expect(iterResultObj)
					.to.deep.equal({
						done: true,
						value: undefined
					})
			})			

			describe.skip('and the search token list is bigger than the subtree node levels', function () {
				it('should consider the search over', function () {
					expect(false).to.be.true
				})
			})
		})
	})
})