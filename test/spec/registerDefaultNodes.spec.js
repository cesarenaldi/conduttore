define([
	'registerDefaultNodes',
	'NodeFactory'
], function (registerDefaultNodes, NodeFactory) {

	var factory = new NodeFactory(sinon.spy())
	
	describe('registerDefaultNodes', function () {

		before(function () {
			registerDefaultNodes(factory)
		})

		it('should initialize the factory with default node types', function () {
			
		})
	})
})