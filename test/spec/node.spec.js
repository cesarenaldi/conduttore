define([
	'node'
], function (node) {

	var createNode = node.create,
		NodeSpecificity = node.Specificity
	
	describe('when creating a new node', function () {

		it('should throw a TypeError when the matcher type is not supported', function () {
			function testCase () {
				createNode('type1', true) // boolean is not a supported match type
			}
			expect(testCase).to.throw(TypeError)
		})

		describe('and a specificity is specified', function () {

			it('should use that as node specificity', function () {
				var node = createNode('type1', function () {}, NodeSpecificity.TIGHT)
				expect(node.specificity).to.equal(NodeSpecificity.TIGHT)
			})
		})

		describe('when the matcher definition is an array of strings', function () {

			it('should generate a reg exp based node factory using the array values', function () {

				var node = createNode(':array-type', ['work', 'home']),
					result;
				
				result = node.match('work', [])
				expect(result).to.be.true
				expect(node.specificity).to.equal(NodeSpecificity.LOOSE)
			})
		})

		describe('when the matcher definition is a function', function () {
			
			it('should be used directly as matcher function of the node', function () {
				var matcher = sinon.spy(),
					node = createNode(':func-type', matcher),
					TOKEN = 'token',
					PARAMS = []

				result = node.match(TOKEN, PARAMS)
				expect(matcher).to.be.calledWith(TOKEN, PARAMS)
				expect(node.specificity).to.equal(NodeSpecificity.TIGHT)
			})	
		})

		describe('when the matcher definition is a regular expression', function () {
			
			it('should create a regexp based node factory', function () {
				var dummyRegExp = /pluto/,
					node = createNode(':regexp-type', dummyRegExp),
					result;
				
				result = node.match('pluto', [])
				expect(result).to.be.true
				expect(node.specificity).to.equal(NodeSpecificity.LOOSEST)
			})	
		})
	})
})