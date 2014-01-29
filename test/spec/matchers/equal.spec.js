define([
	'matchers/equal'
], function (equal) {
	
	describe('equal matcher', function () {

		it('should match the provided string at the beginning of the target string returning the eventual remainder', function () {
			var testEqual = equal('pluto')

			expect( testEqual('pluto') ).to.be.true
			expect( testEqual('plutone') ).to.equal('ne')
		})
	})
})