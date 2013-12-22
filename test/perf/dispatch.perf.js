define([
	'underscore'
], function (_) {

	return
	
	var i = 0

	benchmark('Dispatch', function () {

		when('iterating over an array', function () {
			i++
		})

		when('iterating over an object', function () {
			i++
			i++
		})
	})
})