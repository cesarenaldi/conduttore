define([
	'NodeFactory',
	'node'
], function (NodeFactory, node) {

	var DUMMY_NODE = {},
		TYPE = ':type',

		NodeSpecificity = node.Specificity,

		nodeBuilderStub = sinon.stub().returns(DUMMY_NODE),
		dummyMatcher = function () {},
		testObj = new NodeFactory(nodeBuilderStub);
		
	describe('NodeFactory', function () {

		beforeEach(function () {})

		describe('when creating nodes', function () {

			before(function () {
				testObj.register(TYPE, dummyMatcher)
			})		

			it('should use the node builder passing the registered match function', function () {

				var node = testObj.create(TYPE)

				expect(node).to.equal(DUMMY_NODE)
				expect( nodeBuilderStub ).to.be.calledWith(TYPE, dummyMatcher)
			})

			it('should use the node builder passing an exact match function and the highest specificity', function () {

				var node = testObj.create('unknown')

				expect(node).to.equal(DUMMY_NODE)
				expect( nodeBuilderStub ).to.be.calledWith('unknown', sinon.match.func, NodeSpecificity.TIGHT)
			})
		})

		describe('when registering an alias for an existing node factory', function () {

			var matchFunction = function () {},
				nodeBuilderStub = sinon.stub().returns(DUMMY_NODE),
				testObj = new NodeFactory(nodeBuilderStub);

			before(function () {
				testObj.register(':original', matchFunction)
				testObj.register(':alias_for_original', ':original')
			})

			it('should create the node using the factory for the aliased type', function () {

				var node = testObj.create(':alias_for_original')

				expect(nodeBuilderStub).to.be.calledWith(':alias_for_original', matchFunction);
				expect(node).to.equal(DUMMY_NODE)
			})
		})

		describe('when creating a root node', function () {

			it('should create a simple node', function () {
				var node = testObj.createRoot()
				
				expect(node).to.equal(DUMMY_NODE)
				expect(nodeBuilderStub).to.be.calledWith(sinon.match.string, sinon.match.func)
			})
		})

		describe('when restoring a node', function () {

			var matchFunction = function () {},
				nodeBuilderStub = sinon.stub().returns(DUMMY_NODE),
				testObj = new NodeFactory(nodeBuilderStub),

				nodeToRestore = {
					type: ':type'
				},

				anotherNodeToRestore = {
					type: '/part1'
				}

			before(function () {
				testObj.register(':type', matchFunction)
			})

			it('should re-assing the proper match function', function () {
				testObj.restore(nodeToRestore)
				expect(nodeToRestore)
					.to.have.property('match')
					.that.is.deep.equal(matchFunction)
			})

			it('should re-assing the proper match function', function () {
				testObj.restore(anotherNodeToRestore)
				expect(anotherNodeToRestore)
					.to.have.property('match')
					.that.is.an.instanceOf(Function)
			})
		})
	})
})