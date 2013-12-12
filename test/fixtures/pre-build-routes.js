define(['./404'], function (defaultHanlder) {

	function foo () {
		return 1
	}

	return {
		aliases: {
			':controller': ':text',
			':action': ':text'
		},

		params: {
			':type': ['topolino', 'pluto']
		},

		routes: {
			'/:controller/:action/:type': './route-handler',
			'*': defaultHanlder
		}
	}
})