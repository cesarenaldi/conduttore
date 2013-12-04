define({

	aliases: {
		// aliases
		':controller': ':text',
		':action': ':text'
	},

	params: {
		// custom
		':type': ['topolino', 'pluto']
	},

	routes: {
		'/:controller/:action/:type': 'path/to/module',
		'*': 'path/to/404/module'
	}
})