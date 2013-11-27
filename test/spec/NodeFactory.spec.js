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
		})

		describe('when registering a new node factory function', function () {

			it('should interact with the builder to create a new factory function', function () {
				testObj.register(TYPE, dummyParam)
				expect(builderStub).to.be.calledWith(TYPE, dummyParam)
			})
		})

		describe('when creating nodes', function () {			

			it('should invoke factory the corresponding factory function', function () {
				testObj.create(TYPE, 'ciao')
				expect( factoryStub ).to.be.calledWith('ciao')
			})

			it('should create an exact matching node when the requested type is not registered', function () {
				var node = testObj.create('unknown', 'value')

				expect(node).to.equal(DUMMY_NODE)
				expect(factoryStub).to.be.calledWith('value')
			})
		})

		describe('when creating a root node', function () {

			it('should create a simple node', function () {
				var node = testObj.createRoot()
				
				expect(node).to.equal(DUMMY_NODE)
				expect(factoryStub).to.be.calledOnce
			})
		})
	})
})