define([
	'matchers/number'
], function (number) {
	
	describe('number matcher', function () {

		var match = number()

		it('should match positive integers', function () {
			var params = []
			expect( match('456', params) ).to.be.true
			expect( params[0] ).to.be.a('number')
			expect( params[0] ).to.equal(456)
		})

		it('should match negative integers', function () {
			var params = []
			expect( match('-456', params) ).to.be.true
			expect( params[0] ).to.be.a('number')
			expect( params[0] ).to.equal(-456)
		})

		it('should match positive floats', function () {
			var params = []
			expect( match('0.456', params) ).to.be.true
			expect( params[0] ).to.be.a('number')
			expect( params[0] ).to.equal(0.456)
		})

		it('should match negative floats', function () {
			var params = []
			expect( match('-0.456', params) ).to.be.true
			expect( params[0] ).to.be.a('number')
			expect( params[0] ).to.equal(-0.456)
		})

		it('should not match any other string', function () {

		})
	})
})