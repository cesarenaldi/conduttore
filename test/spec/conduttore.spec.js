define([
	'conduttore',
	'fixtures/routes'
], function (conduttore, config) {


	describe('conduttore', function () {
		
		it('should be used also as AMD loader plugin', function (done) {
			
			require(['conduttore!fixtures/routes'], function (router) {
				expect(router).to.have.property('resolve')
				expect(router).to.have.property('dispatch')
				expect(router).to.have.property('connect')

				router.dispatch('/users/edit/topolino')
				expect(config.routes[0]['/:controller/:action/:type']).to.be.calledOnce//With('users', 'edit', 'topolino')
				expect(config.routes[1]['*']).to.not.be.called

				done()
			})
		})
	})
})
