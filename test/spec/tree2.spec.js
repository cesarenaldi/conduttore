define([
	'underscore',
	'tree2'
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
            
            var Z_VALUE = function () {},

            	Y_VALUE = function () {},

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
				NODE_Y.match.withArgs('ymatch').returns(true)
				NODE_Y.match.returns(false)
				NODE_Z.match.returns(true)
			})

			beforeEach(function () {
				NODE_X.match.reset()
				NODE_Y.match.reset()
				NODE_Z.match.reset()
			})
            
            it('should walk the tree', function () {
                var params = [],
                	tokens = ['xmatch', 'zmatch'],
                	levels = _.rest(tokens).length

                testObj.search(tokens, params)
                expect(NODE_Y.match).to.be.calledWith(tokens[0], params)
                expect(NODE_X.match).to.be.calledWith(tokens[0], params)
                expect(NODE_Z.match).to.be.calledWith(tokens[1], params)
            })

            it('should stop if there is no more tokens', function () {
            	var params = [],
            		tokens = ['xmatch']

            	testObj.search(tokens, params)
            	expect(NODE_Z.match).to.not.be.called
            })

            it('should stop if there is no more nodes', function () {
				var params = [],
            		tokens = ['ymatch', 'pluto'],

            		value = testObj.search(tokens, params)

            	expect(value).to.equal(undefined)	
            	expect(NODE_Y.match).to.be.called
            })

            it('should return the value of the found node', function () {

            	var value

            	value = testObj.search(['topolino', 'pippo'], [])
            	expect(value).to.equal(Z_VALUE)

            	value = testObj.search(['ymatch'], [])
				expect(value).to.equal(Y_VALUE)

				value = testObj.search(['ymatch', 'another'], [])
				expect(value).to.equal(undefined)
            })
		})

	})
})