define([
	'utils/functions'
], function (functions) {
	
	describe('functions', function () {

		describe('defer', function () {

			it('should call the function asynchronously', function (done) {
				functions.defer(function () {
					done()
				})
			})

			it('should pass the varargs after the first one to the function as actual parameters', function (done) {

				var PARAM_1 = 1,
					PARAM_2 = 'due'

				functions.defer(function (arg0, arg1) {
					expect(arg0).to.equal(PARAM_1)
					expect(arg1).to.equal(PARAM_2)
					done()
				}, PARAM_1, PARAM_2)
			})
		})
	})
})