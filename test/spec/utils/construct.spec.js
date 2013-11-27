define([
	'underscore',
	'utils/construct'
], function (_, construct) {

	var argsSpy = sinon.spy(),
		Type = function () {
			argsSpy.apply(argsSpy, _.toArray(arguments))
		}
	
	describe('construct function', function () {

		it('should create an instance of the specified type passing a variable number of arguments', function () {
			expect( construct(Type) ).to.be.an.instanceof(Type)
			expect( argsSpy.getCall(0).args.length ).to.equal(0)

			construct(Type, 'arg1')
			expect( argsSpy.getCall(1).args.length ).to.equal(1)

			construct(Type, 'arg1', 'arg2')
			expect( argsSpy.getCall(2).args.length ).to.equal(2)
		})
	})
})