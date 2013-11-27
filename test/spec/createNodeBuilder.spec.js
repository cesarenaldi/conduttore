define([
	'createNodeBuilder',
	'Node'
], function (createNodeBuilder, Node) {

	var NodeSpecificity = Node.Specificity;
	
	describe('createNodeBuilder', function () {

		it('should throw a TypeError when the matcher type is not supported', function () {
			function testCase () {
				createNodeBuilder('type1', true)
			}
			expect(testCase).to.throw(TypeError)
		})

		// TODO: verificy spcificity for node creted with forced specificity

		describe('when the matcher definition is an array of strings', function () {

			it('should generate a reg exp based node factory using the array values', function () {

				var node = createNodeBuilder(':array-type', ['work', 'home']).call(),
					result;
				
				result = node.match('work', 0, [])
				expect(result).to.be.true
				expect(node.specificity).to.equal(NodeSpecificity.LOOSE)
			})
		})

		describe('when the matcher definition is a function', function () {
			
			it('should be used directly as matcher function of the node', function () {
				var matcher = sinon.spy(),
					node = createNodeBuilder(':func-type', matcher).call(),
					TOKEN = 'token',
					PARAMS = []

				result = node.match(TOKEN, 0, PARAMS)
				expect(matcher).to.be.calledWith(TOKEN, PARAMS)
				expect(node.specificity).to.equal(NodeSpecificity.TIGHT)
			})	
		})

		describe('when the matcher definition is a regular expression', function () {
			
			it('should create a regexp based node factory', function () {
				var dummyRegExp = /pluto/,
					node = createNodeBuilder(':regexp-type', dummyRegExp).call(),
					result;
				
				result = node.match('pluto', 0, [])
				expect(result).to.be.true
				expect(node.specificity).to.equal(NodeSpecificity.LOOSEST)
			})	
		})
	})
})