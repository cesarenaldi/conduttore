define([
	'matchers/regexp'
], function (regexp) {
	
	describe('regexp matcher', function () {

		it('should match string with provided RegExp', function () {
			var params = [],
				re = /^(pippo|pluto|topolino)$/;

			expect( regexp(re)('pluto', params) ).to.be.true
			expect( params[0] ).to.equal('pluto')
		})
	})
})