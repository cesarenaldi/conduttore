define(['./404'], function (defaultHanlder) {


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