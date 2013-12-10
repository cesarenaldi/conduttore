define({

	aliases: {
		':controller': ':text',
		':action': ':text'
	},

	params: {
		':type': ['topolino', 'pluto']
	},

	routes: {
		'/:controller/:action/:type': sinon.spy(),
		'*': sinon.spy()
	}
})