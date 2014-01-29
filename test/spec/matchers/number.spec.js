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
			var params = []
			expect( match('..5', params) ).to.be.false
			expect( match('abc', params) ).to.be.false
		})

		it('should match the initial number and return the target string reminder', function () {
			var params = []
			expect( match('1bc', params) ).to.equal('bc')
			expect( params[0] ).to.equal(1)
		})
	})
})