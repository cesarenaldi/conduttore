define([
	'underscore',
	'Tree'
], function (_, Tree) {

	var TRUTHY_VALUE = true,
		UNDEFINED_VALUE = undefined,
		UNDEFINED_LEAF_TYPE = 'pippo',

		rootMock = {
			insert: sinon.stub(),
			first: sinon.stub(),
			value: undefined
		},
		nodeMock = {
			insert: sinon.stub(),
			first: sinon.stub(),
			value: UNDEFINED_VALUE
		},
		leafMock = {
			insert: sinon.stub(),
			first: sinon.stub(),
			value: TRUTHY_VALUE
		},
		nodeFactoryMock = {
			create: sinon.stub(),
			createRoot: sinon.stub().returns(rootMock)
		};

	var ATOMS = [':type1', ':type2']

	nodeFactoryMock.create.withArgs(':root').returns(rootMock)

	_.each(ATOMS, function (atom) {
		nodeFactoryMock.create.withArgs(atom).returns(nodeMock)	
	})

	describe('Tree', function () {

		describe('when inserting a new list of atoms', function () {

			var testObj = new Tree(nodeFactoryMock),
				VALUE = 'value'

			before(function () {
				rootMock.insert.returns(nodeMock)
				nodeMock.insert.returns(leafMock)
			});

			beforeEach(function () {
				rootMock.insert.reset()
				nodeFactoryMock.create.reset()
			})

			it('should insert node starting from the root node', function () {
				testObj.insert(ATOMS, VALUE)
				expect(rootMock.insert).to.be.calledOnce
			})

			it('should create a Node for each atom', function () {
				testObj.insert(ATOMS, VALUE)
				expect(nodeFactoryMock.create).to.be.calledTwice
				expect(nodeFactoryMock.create.firstCall.args[0]).to.equal(ATOMS[0])
				expect(nodeFactoryMock.create.secondCall.args[0]).to.equal(ATOMS[1])
				
				expect(leafMock.value).to.equal(VALUE)
			})

		})

		describe('when searching a token list', function () {
            
            var testObj = new Tree(nodeFactoryMock)

            before(function () {
            	rootMock.first.returns(nodeMock)
            	nodeMock.first.withArgs(UNDEFINED_LEAF_TYPE).returns(undefined)
            	nodeMock.first.returns(leafMock)
            	rootMock.first.reset()
            	nodeMock.first.reset()
            	leafMock.value = TRUTHY_VALUE
            })
            
            it('should walk the tree', function () {
                var params = [],
                	tokens = ['topolino'],
                	levels = _.rest(tokens).length

                testObj.search(tokens, params)
                expect(rootMock.first).to.be.calledWith(tokens[0], levels, params)
            })

            it('should stop if there is no more tokens', function () {
            	var params = [],
            		tokens = ['topolino']

            	testObj.search(tokens, params)
            	expect(nodeMock.first).to.not.be.called
            })

            it('should stop if there is no more nodes', function () {
				var params = [],
            		tokens = ['topolino', UNDEFINED_LEAF_TYPE]

            	testObj.search(tokens, params)
            	expect(leafMock.first).to.not.be.called
            })

            it('should return the value of the found node', function () {
            	var params = [],
            		tokens = ['topolino', 'pluto'],

            		value = testObj.search(tokens, params)

            	expect(value).to.equal(TRUTHY_VALUE)
            })

            it('should return undefined if no paths matches the given tokens', function () {
				var params = [],
            		tokens = ['topolino', UNDEFINED_LEAF_TYPE],

            		value = testObj.search(tokens, params)

            	expect(value).to.equal(undefined)
            })
		})
	})
})