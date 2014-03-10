define([
	'underscore',
	'tree'
], function (_, createTree) {


	describe('Tree', function () {

		describe('when created', function () {

			var EMPTY_ROOT = {
				type: 'root-456',
				lookup: {},
				levels: 0,
				children: [ [], [], [] ]
			},
			
			nodeFactoryMock = {
				create: sinon.stub(),
				createRoot: sinon.stub()
			}

			before(function () {
				nodeFactoryMock.createRoot.returns(EMPTY_ROOT)
			})

			beforeEach(function () {
				nodeFactoryMock.createRoot.reset()
			})

			it('should create a root node if no init data are provided', function () {
				createTree(nodeFactoryMock)
				expect(nodeFactoryMock.createRoot).to.be.calledOnce
			})

			it('should use the init data to pre-populate the tree', function () {
				createTree(nodeFactoryMock, EMPTY_ROOT)
				expect(nodeFactoryMock.createRoot).to.not.be.called
			})
		})

		describe('when inserting a new list of nodes', function () {

			var ROOT = {
					type: 'root-456',
					lookup: {},
					levels: 0,
					children: [ [], [], [] ]
				},

				NODE_A = {
					type: ':type1',
					levels: 0,
					lookup: {},
					specificity: 0,
					children: [ [], [], [] ]
				},

				NODE_B = {
					type: ':type2',
					lookup: {},
					levels: 0,
					specificity: 1,
					children: [ [], [], [] ]
				},

				VALUE = 'value',

				PATH_1 = [':type1', ':type2'],

				PATH_2 = [':type3', ':type4'],

				nodeFactoryMock,

				testObj,

				root, node_1, node_2;

			before(function () {
				nodeFactoryMock = {
					create: sinon.stub(),
					createRoot: sinon.stub()
				}

				node_1 = _.clone(NODE_A)
				node_2 = _.clone(NODE_B)
				root = _.clone(ROOT)

				nodeFactoryMock.createRoot.returns(root)
				nodeFactoryMock.create.withArgs(':type1').returns(node_1)
				nodeFactoryMock.create.withArgs(':type2').returns(node_2)

				testObj = createTree(nodeFactoryMock)
			})

			beforeEach(function () {
				nodeFactoryMock.create.reset()
			})

			it('should create a Node for each pattern updating the levels properly', function () {
				testObj.insert(PATH_1, VALUE)
				expect(nodeFactoryMock.create).to.be.calledTwice
				expect(nodeFactoryMock.create.firstCall.args[0]).to.equal(PATH_1[0])
				expect(nodeFactoryMock.create.secondCall.args[0]).to.equal(PATH_1[1])
				expect(node_2.value).to.equal(VALUE)
				expect(root.levels).to.equal(2)
				expect(node_1.levels).to.equal(1)
				expect(node_2.levels).to.equal(0)
			})

			it('should avoid duplication and re-use existing nodes', function () {
				testObj.insert(PATH_1, 'anothervalue')
				expect(nodeFactoryMock.create).to.not.be.called
				expect(node_2.value).to.equal('anothervalue')
			})
		})

		describe('when searching a token list', function () {
			
			var X_VALUE = function (x) {},

				Y_VALUE = function (y) {},

				Z_VALUE = function (z) {},

				NODE_Z = {
					type: 'leaf',
					lookup: {},
					match: sinon.stub(),
					value: Z_VALUE,
					children: [ [], [], [] ]
				},

				NODE_X = {
					type: 'node_x',
					lookup: {
						'leaf': NODE_Z
					},
					match: sinon.stub(),
					value: X_VALUE,
					children: [
						[], [ NODE_Z ], []
					]
				},

				NODE_Y = {
					type: 'node_y',
					lookup: {},
					match: sinon.stub(),
					value: Y_VALUE,
					children: [
						[], [ ], []
					]
				},

				TREE_DATA = {
					type: 'root-123',
					lookup: {
						'node_x': NODE_X,
						'node_y': NODE_Y
					},
					children: [
						[ NODE_Y ],
						[ NODE_X ],
						[]
					]
				},
		
				nodeFactoryMock = {
					create: sinon.stub(),
					createRoot: sinon.stub()
				},

				testObj = createTree(nodeFactoryMock, TREE_DATA)

			before(function () {
				NODE_X.match.returns(true)
				NODE_Z.match.returns(true)
				NODE_Y.match.returns(true)
			})

			beforeEach(function () {
				NODE_X.match.reset()
				NODE_Y.match.reset()
				NODE_Z.match.reset()
			})
			
			it.skip('should walk the tree', function () {
				var params = [],
					tokens = ['xmatch', 'zmatch'],
					levels = _.rest(tokens).length

				testObj.search(tokens, params)
				expect(NODE_Y.match).to.be.calledWith(tokens[0], params)
				expect(NODE_X.match).to.be.calledWith(tokens[0], params)
				expect(NODE_Z.match).to.be.calledWith(tokens[1], params)
			})

			it.skip('should stop if there is no more tokens', function () {
				var params = [],
					tokens = ['xmatch']

				testObj.search(tokens, params)
				expect(NODE_Z.match).to.not.be.called
			})

			 it('should return an iterator-like object', function () {
				var iter,
					iterResultObj

				iter = testObj.search(['topolino', 'pippo'], [])
				iterResultObj = iter.next()

				expect(iter)
					.to.respondTo('next')
				expect(iterResultObj)
					.to.contain.keys('done', 'value')
			})

			it('should return the found node value as value of the iterator result object', function () {

				var iter, iterResultObj

				iter = testObj.search(['topolino', 'pippo'], [])
				iterResultObj = iter.next()

				expect(iterResultObj)
					.to.deep.equal({
						value: Z_VALUE,
						done: false
					})
			})

			describe('and iterating through the searches', function () {

				it('should return the first search result', function () {
					var iter, iterResultObj

					iter = testObj.search(['topolino'], [])

					iterResultObj = iter.next()

					expect(iterResultObj)
						.to.deep.equal({
							done: false,
							value: Y_VALUE
						})
				})

				it('should stop the iteration at the second iter#next call', function () {

				 	var iter, iterResultObj

					iter = testObj.search(['topolino'], [])

					iterResultObj = iter.next()
					iterResultObj = iter.next()

					expect(iterResultObj)
						.to.deep.equal({
							done: false,
							value: undefined
						})
				 })
			})

			describe('and invoking next thrice on the iterator object', function () {
				 it('should stop the search', function () {

				 	var iter, iterResultObj

					iter = testObj.search(['topolino', 'pippo'], [])
					iterResultObj = iter.next()
					iterResultObj = iter.next()
					iterResultObj = iter.next()

					expect(iterResultObj)
						.to.have.property('done', true)
						.and.to.not.have.property('value')
				 })
			})

			describe('and the search list is longer than the node levels', function () {
				 it('should stop the search', function () {

					var iter = testObj.search(['ymatch', 'pluto'], []),
						iterResultObj = iter.next()

					expect(iterResultObj)
						.to.have.property('done', true)
						.and.to.not.have.property('value')
				})
			})
		})

		describe('when continuing a search', function () {

			var X_VALUE = function () {},
				Y_VALUE = function () {},

				NODE_X = {
					type: 'node_x',
					lookup: {},
					match: sinon.stub().returns(true),
					children: [
						[], [], []
					],
					value: X_VALUE
				},

				NODE_Y = {
					type: 'node_y',
					lookup: {},
					match: sinon.stub().returns(true),
					children: [
						[], [], []
					],
					value: Y_VALUE
				},

				TREE_DATA = {
					type: 'root-123',
					lookup: {
						'node_x': NODE_X,
						'node_y': NODE_Y
					},
					match: function () {},
					children: [
						[ NODE_X ], [ NODE_Y ], []
					]
				},
		
				nodeFactoryMock = {},

				testObj = createTree(nodeFactoryMock, TREE_DATA)

			it('should raise an error if no previous search', function () {
				function testCase () {
					testObj.continue()
				}

				expect(testCase).to.throw(Error)
			})

			it('should continue the previous search considering the previous found node as not valid', function () {

				var value = testObj.search('/matching/path')

				expect(value).to.deep.equal(X_VALUE)
				value = testObj.continue()
				expect(value).to.deep.equal(Y_VALUE)
			})
		})

		describe('when exporting/importing the tree structure', function () {

			var X_VALUE = function () {},

				NODE_X = {
					type: 'node_x',
					lookup: {},
					match: sinon.stub(),
					children: [
						[], [], []
					],
					value: X_VALUE
				},

				TREE_DATA = {
					type: 'root-123',
					lookup: {
						'node_x': NODE_X
					},
					match: function () {},
					children: [
						[ NODE_X ], [], []
					]
				},
		
				nodeFactoryMock = {
					create: sinon.stub(),
					createRoot: sinon.stub(),
					restore: sinon.spy()
				},

				testObj = createTree(nodeFactoryMock, TREE_DATA)

			it('should export avoiding circular references to be resolved as copies', function () {
				var tree = testObj.export()
				expect(tree).to.not.have.property('match')
				expect(tree.children[0][0]['$ref']).to.equal('$["lookup"]["node_x"]')
				expect(tree.lookup['node_x']).to.be.an('Object')
			})

			it('should import restoring the appropriate data structure/match functions', function () {
				var tree = testObj.export(),
					newTestObj = createTree(nodeFactoryMock)

				newTestObj.import(tree)
				expect(nodeFactoryMock.restore).to.be.calledTwice
			})
		})
	})
})