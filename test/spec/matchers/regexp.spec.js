define([
	'matchers/regexp'
], function (regexp) {
	
	describe('regexp matcher', function () {

		describe('when the target string has an exact match', function () {
			it('should return true', function () {

				var params = [],
					re = /^(pippo|pluto|topolino)/gi;

				expect( regexp(re)('pluto', params) ).to.be.true
				expect( params[0] ).to.equal('pluto')
			})
		})

		describe('when the target string has a match plus a reminder', function () {
			it('should returns the reminder', function () {

				var params = [],
					re = /^(pippo|pluto|topolino)/;

				expect( regexp(re)('plutone', params) ).to.equal('ne')
				expect( params[0] ).to.equal('pluto')
			})
		})

		describe('when the regular expression contains EOL anchor (i.e. $)', function () {
			it('should throw an Error', function () {

				function testCase () {
					regexp(/pluto$/)
				}

				expect(testCase).to.throw(Error)
			})
		})

		describe('when the regular expression contains escaped dollar sign as last char (i.e. \$)', function () {
			it('should NOT throw any Error', function () {

				function testCase () {
					regexp(/pluto\$/)
				}

				expect(testCase).to.not.throw(Error)
			})
		})

		describe('when a parsing function is provided', function () {
			it('should use it to manipulate the matching param', function () {

				var parseStub = sinon.stub().returns('transformed'),
					params = [],
					re = /^(pippo|pluto|topolino)/

				expect( regexp(re, parseStub)('pluto', params) ).to.be.true
				expect( parseStub ).to.be.calledWith('pluto')
				expect( params[0] ).to.equal('transformed')
			})
		})
	})
})