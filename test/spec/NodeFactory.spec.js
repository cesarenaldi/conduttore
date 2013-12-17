define([
	'NodeFactory',
	'Node'
], function (NodeFactory, Node) {

	var DUMMY_NODE = {},
		TYPE = ':type';

	var factoryStub = sinon.stub().returns(DUMMY_NODE),
		builderStub = sinon.stub().returns(factoryStub),
		dummyParam = function () {},
		testObj = new NodeFactory(builderStub);
		
	describe('NodeFactory', function () {

		beforeEach(function () {
			factoryStub.reset()
			builderStub.reset()
		})

		describe('when registering a new node factory function', function () {

			it('should interact with the builder to create a new factory function', function () {
				testObj.register(TYPE, dummyParam)
				expect(builderStub).to.be.calledWith(TYPE, dummyParam)
			})
		})

		describe('when creating nodes', function () {

			before(function () {
				builderStub.reset()
			})		

			it('should invoke factory the corresponding factory function', function () {
				testObj.create(TYPE)
				expect( factoryStub ).to.be.calledOnce
			})

			it('should create an exact matching node when the requested type is not registered', function () {
				var node = testObj.create('unknown', 'value')

				expect(node).to.equal(DUMMY_NODE)
				expect(builderStub).to.be.calledWith('unknown', sinon.match.func, sinon.match.number)
			})
		})

		describe('when registering an alias for an existing node factory', function () {

			var factorySpy = sinon.spy(),
				builderStub = sinon.stub().returns(factorySpy),
				testObj = new NodeFactory(builderStub);

			before(function () {
				testObj.register(':original', function () {})
				testObj.register(':alias_for_original', ':original')
			})

			it('should create the node using the factory for the aliased type', function () {
				testObj.create(':alias_for_original')
				expect(factorySpy).to.be.calledOnce;
			})
		})

		describe('when creating a root node', function () {

			it('should create a simple node', function () {
				var node = testObj.createRoot()
				
				expect(node).to.equal(DUMMY_NODE)
				expect(factoryStub).to.be.calledOnce
			})
		})

		describe('when restoring a node', function () {

			var factorySpy = sinon.spy(),
				builderStub = sinon.stub().returns(factorySpy),
				testObj = new NodeFactory(builderStub),

				nodeToRestore = {
					type: ':type'
				}

			before(function () {
				factorySpy.matcher = function () {}
				testObj.register(':type', function () {})
			})

			it('should re-assing the proper match function', function () {
				testObj.restore(nodeToRestore)
				expect(nodeToRestore)
					.to.have.property('match')
					.that.is.deep.equal(factorySpy.matcher)
			})
		})
	})
})